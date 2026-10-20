/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - API DUA ARAH DASHBOARD ANALISIS SURVEI LAN RI (v2.0)
 * ==============================================================================
 * Skrip ini dipasang di Google Spreadsheet: "Rekap Publikasi LAN"
 * Berfungsi sebagai jembatan API (GET untuk membaca data, POST untuk update data)
 * ==============================================================================
 */

// Target Sheet GID (Tab Analisis/Suvei 2026 memiliki GID: 988003932)
const TARGET_GID = 988003932;

/**
 * Mencari sheet target secara cerdas (berdasarkan GID atau variasi nama)
 */
function getTargetSheet(ss) {
  const sheets = ss.getSheets();
  
  // 1. Prioritas utama: cari berdasarkan GID (988003932)
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === TARGET_GID) {
      return sheets[i];
    }
  }
  
  // 2. Prioritas kedua: cari tab yang mengandung kata "analisis", "suvei", "survei", atau "2026"
  for (let i = 0; i < sheets.length; i++) {
    const name = sheets[i].getName().toLowerCase();
    if ((name.includes("analisis") || name.includes("suvei") || name.includes("survei")) && name.includes("2026")) {
      return sheets[i];
    }
  }
  
  // 3. Fallback: jika tidak ditemukan, gunakan sheet dengan data terbanyak
  let maxRows = 0;
  let bestSheet = sheets[0];
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getLastRow() > maxRows) {
      maxRows = sheets[i].getLastRow();
      bestSheet = sheets[i];
    }
  }
  return bestSheet;
}

/**
 * Mendeteksi posisi kolom header secara dinamis
 */
function getColumnMapping(headerRow) {
  const mapping = {
    no: -1, unit: -1, judul: -1, jenis: -1, jadwal: -1, tahun: -1,
    cluster1: -1, cluster2: -1, jurnal: -1, media_online: -1,
    web_lan: -1, web_unit: -1, ig_lan: -1, ig_unit: -1,
    yt_lan: -1, yt_unit: -1, keterangan: -1, status: -1
  };
  
  for (let c = 0; c < headerRow.length; c++) {
    const colName = String(headerRow[c] || "").trim().toLowerCase();
    
    if (colName === "no" || colName === "no.") mapping.no = c;
    else if (colName === "unit" || colName === "unit kerja" || colName === "satuan kerja") mapping.unit = c;
    else if (colName.includes("judul") || colName === "topik") mapping.judul = c;
    else if (colName === "jenis" || colName.includes("luaran")) mapping.jenis = c;
    else if (colName.includes("jadwal")) mapping.jadwal = c;
    else if (colName === "tahun") mapping.tahun = c;
    else if (colName.includes("cluster 1") || colName.includes("klaster 1") || colName === "cluster") mapping.cluster1 = c;
    else if (colName.includes("cluster 2") || colName.includes("klaster 2")) mapping.cluster2 = c;
    else if (colName.includes("jurnal")) mapping.jurnal = c;
    else if (colName.includes("media online") || colName === "media") mapping.media_online = c;
    else if (colName.includes("website lan") || colName === "web lan") mapping.web_lan = c;
    else if (colName.includes("website unit") || colName === "web unit") mapping.web_unit = c;
    else if (colName.includes("instagram lan") || colName === "ig lan") mapping.ig_lan = c;
    else if (colName.includes("instagram unit") || colName === "ig unit") mapping.ig_unit = c;
    else if (colName.includes("youtube lan") || colName === "yt lan") mapping.yt_lan = c;
    else if (colName.includes("youtube unit") || colName === "yt unit") mapping.yt_unit = c;
    else if (colName.includes("keterangan") || colName.includes("catatan")) mapping.keterangan = c;
    else if (colName.includes("status")) mapping.status = c;
  }
  
  // Fallback ke urutan default jika tidak terdeteksi dari teks header
  if (mapping.no === -1) mapping.no = 0;
  if (mapping.unit === -1) mapping.unit = 1;
  if (mapping.judul === -1) mapping.judul = 2;
  if (mapping.jenis === -1) mapping.jenis = 3;
  if (mapping.jadwal === -1) mapping.jadwal = 4;
  if (mapping.tahun === -1) mapping.tahun = 5;
  if (mapping.cluster1 === -1) mapping.cluster1 = 6;
  if (mapping.cluster2 === -1) mapping.cluster2 = 7;
  if (mapping.jurnal === -1) mapping.jurnal = 8;
  if (mapping.media_online === -1) mapping.media_online = 9;
  if (mapping.web_lan === -1) mapping.web_lan = 10;
  if (mapping.web_unit === -1) mapping.web_unit = 11;
  if (mapping.ig_lan === -1) mapping.ig_lan = 12;
  if (mapping.ig_unit === -1) mapping.ig_unit = 13;
  if (mapping.yt_lan === -1) mapping.yt_lan = 14;
  if (mapping.yt_unit === -1) mapping.yt_unit = 15;
  if (mapping.keterangan === -1) mapping.keterangan = 16;
  
  return mapping;
}

/**
 * Handle HTTP GET Request
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getTargetSheet(ss);
    const values = sheet.getDataRange().getValues();
    
    if (values.length <= 1) {
      return createJsonResponse({ status: "success", data: [], sheetName: sheet.getName() });
    }
    
    // Temukan baris header (biasanya baris 0 atau baris yang mengandung 'judul')
    let headerRowIndex = 0;
    for (let r = 0; r < Math.min(5, values.length); r++) {
      const rowStr = values[r].join(" ").toLowerCase();
      if (rowStr.includes("judul") && rowStr.includes("unit")) {
        headerRowIndex = r;
        break;
      }
    }
    
    const colMap = getColumnMapping(values[headerRowIndex]);
    const surveys = [];
    
    for (let i = headerRowIndex + 1; i < values.length; i++) {
      const row = values[i];
      const no = row[colMap.no];
      const unit = String(row[colMap.unit] || "").trim();
      const judul = String(row[colMap.judul] || "").trim();
      
      // Lewati baris kosong
      if (!no && !unit && !judul) continue;
      
      const item = {
        no: isNaN(Number(no)) ? String(no || "") : Number(no),
        unit: unit,
        judul: judul,
        jenis: String(row[colMap.jenis] || "").trim(),
        jadwal: String(row[colMap.jadwal] || "").trim(),
        tahun: String(row[colMap.tahun] || "").trim() || "2026",
        cluster1: String(row[colMap.cluster1] || "").trim() || "Lainnya",
        cluster2: String(row[colMap.cluster2] || "").trim(),
        jurnal: String(row[colMap.jurnal] || "").trim(),
        media_online: String(row[colMap.media_online] || "").trim(),
        web_lan: String(row[colMap.web_lan] || "").trim(),
        web_unit: String(row[colMap.web_unit] || "").trim(),
        ig_lan: String(row[colMap.ig_lan] || "").trim(),
        ig_unit: String(row[colMap.ig_unit] || "").trim(),
        yt_lan: String(row[colMap.yt_lan] || "").trim(),
        yt_unit: String(row[colMap.yt_unit] || "").trim(),
        keterangan: String(row[colMap.keterangan] || "").trim()
      };
      
      // Jika di sheet sudah ada kolom status eksplisit, baca langsung
      if (colMap.status !== -1 && row[colMap.status]) {
        item.status = String(row[colMap.status]).trim();
      } else {
        item.status = determineStatus(item.keterangan, item);
      }
      
      surveys.push(item);
    }
    
    return createJsonResponse({
      status: "success",
      total: surveys.length,
      sheetName: sheet.getName(),
      data: surveys
    });
    
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Handle HTTP POST Request
 */
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      payload = e.parameter;
    }
    
    const action = payload.action || "update";
    const data = payload.data || payload;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getTargetSheet(ss);
    const values = sheet.getDataRange().getValues();
    
    let headerRowIndex = 0;
    for (let r = 0; r < Math.min(5, values.length); r++) {
      const rowStr = values[r].join(" ").toLowerCase();
      if (rowStr.includes("judul") && rowStr.includes("unit")) {
        headerRowIndex = r;
        break;
      }
    }
    const colMap = getColumnMapping(values[headerRowIndex]);
    
    if (action === "update") {
      const targetNo = String(data.no).trim();
      let foundRowIndex = -1;
      
      for (let i = headerRowIndex + 1; i < values.length; i++) {
        if (String(values[i][colMap.no]).trim() === targetNo) {
          foundRowIndex = i + 1; // 1-indexed di spreadsheet
          break;
        }
      }
      
      if (foundRowIndex === -1) {
        return createJsonResponse({
          status: "error",
          message: "Data survei No " + targetNo + " tidak ditemukan di sheet."
        });
      }
      
      // Update data di sheet sesuai mapping kolom
      if (data.unit !== undefined && colMap.unit !== -1) sheet.getRange(foundRowIndex, colMap.unit + 1).setValue(data.unit);
      if (data.judul !== undefined && colMap.judul !== -1) sheet.getRange(foundRowIndex, colMap.judul + 1).setValue(data.judul);
      if (data.jenis !== undefined && colMap.jenis !== -1) sheet.getRange(foundRowIndex, colMap.jenis + 1).setValue(data.jenis);
      if (data.jadwal !== undefined && colMap.jadwal !== -1) sheet.getRange(foundRowIndex, colMap.jadwal + 1).setValue(data.jadwal);
      if (data.tahun !== undefined && colMap.tahun !== -1) sheet.getRange(foundRowIndex, colMap.tahun + 1).setValue(data.tahun);
      if (data.cluster1 !== undefined && colMap.cluster1 !== -1) sheet.getRange(foundRowIndex, colMap.cluster1 + 1).setValue(data.cluster1);
      if (data.jurnal !== undefined && colMap.jurnal !== -1) sheet.getRange(foundRowIndex, colMap.jurnal + 1).setValue(data.jurnal);
      if (data.media_online !== undefined && colMap.media_online !== -1) sheet.getRange(foundRowIndex, colMap.media_online + 1).setValue(data.media_online);
      if (data.web_lan !== undefined && colMap.web_lan !== -1) sheet.getRange(foundRowIndex, colMap.web_lan + 1).setValue(data.web_lan);
      if (data.web_unit !== undefined && colMap.web_unit !== -1) sheet.getRange(foundRowIndex, colMap.web_unit + 1).setValue(data.web_unit);
      if (data.ig_lan !== undefined && colMap.ig_lan !== -1) sheet.getRange(foundRowIndex, colMap.ig_lan + 1).setValue(data.ig_lan);
      if (data.ig_unit !== undefined && colMap.ig_unit !== -1) sheet.getRange(foundRowIndex, colMap.ig_unit + 1).setValue(data.ig_unit);
      if (data.yt_lan !== undefined && colMap.yt_lan !== -1) sheet.getRange(foundRowIndex, colMap.yt_lan + 1).setValue(data.yt_lan);
      if (data.yt_unit !== undefined && colMap.yt_unit !== -1) sheet.getRange(foundRowIndex, colMap.yt_unit + 1).setValue(data.yt_unit);
      if (data.keterangan !== undefined && colMap.keterangan !== -1) sheet.getRange(foundRowIndex, colMap.keterangan + 1).setValue(data.keterangan);
      if (data.status !== undefined && colMap.status !== -1) sheet.getRange(foundRowIndex, colMap.status + 1).setValue(data.status);
      
      return createJsonResponse({
        status: "success",
        message: "Data survei No " + targetNo + " berhasil diperbarui di Google Spreadsheet!",
        updatedRow: foundRowIndex
      });
      
    } else if (action === "add") {
      const lastRow = sheet.getLastRow();
      const newNo = data.no || (lastRow);
      
      const newRowArray = [];
      const totalCols = Math.max(...Object.values(colMap)) + 1;
      for (let c = 0; c < totalCols; c++) {
        newRowArray.push("");
      }
      
      if (colMap.no !== -1) newRowArray[colMap.no] = newNo;
      if (colMap.unit !== -1) newRowArray[colMap.unit] = data.unit || "";
      if (colMap.judul !== -1) newRowArray[colMap.judul] = data.judul || "";
      if (colMap.jenis !== -1) newRowArray[colMap.jenis] = data.jenis || "";
      if (colMap.jadwal !== -1) newRowArray[colMap.jadwal] = data.jadwal || "";
      if (colMap.tahun !== -1) newRowArray[colMap.tahun] = data.tahun || "2026";
      if (colMap.cluster1 !== -1) newRowArray[colMap.cluster1] = data.cluster1 || "";
      if (colMap.jurnal !== -1) newRowArray[colMap.jurnal] = data.jurnal || "";
      if (colMap.media_online !== -1) newRowArray[colMap.media_online] = data.media_online || "";
      if (colMap.web_lan !== -1) newRowArray[colMap.web_lan] = data.web_lan || "";
      if (colMap.web_unit !== -1) newRowArray[colMap.web_unit] = data.web_unit || "";
      if (colMap.ig_lan !== -1) newRowArray[colMap.ig_lan] = data.ig_lan || "";
      if (colMap.ig_unit !== -1) newRowArray[colMap.ig_unit] = data.ig_unit || "";
      if (colMap.yt_lan !== -1) newRowArray[colMap.yt_lan] = data.yt_lan || "";
      if (colMap.yt_unit !== -1) newRowArray[colMap.yt_unit] = data.yt_unit || "";
      if (colMap.keterangan !== -1) newRowArray[colMap.keterangan] = data.keterangan || "";
      if (colMap.status !== -1) newRowArray[colMap.status] = data.status || "";
      
      sheet.appendRow(newRowArray);
      
      return createJsonResponse({
        status: "success",
        message: "Agenda survei baru berhasil ditambahkan!",
        newNo: newNo
      });
    }
    
    return createJsonResponse({ status: "error", message: "Action tidak dikenali." });
    
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

/**
 * Logika penentuan status cerdas
 */
function determineStatus(keterangan, item) {
  const ket = (keterangan || "").toLowerCase();
  
  if (ket.includes("selesai") && !ket.includes("belum selesai")) {
    return "Selesai Publikasi";
  }
  if (ket.includes("review") || ket.includes("deputi")) {
    return "Review Policy Brief";
  }
  if (ket.includes("instrumen")) {
    return "Penyusunan Instrumen";
  }
  if (ket.includes("pengumpulan") || ket.includes("responden") || ket.includes("penyebaran")) {
    return "Pengumpulan Data";
  }
  if (ket.includes("pengolahan")) {
    return "Pengolahan Data";
  }
  if (ket.includes("persiapan")) {
    return "Tahap Persiapan";
  }
  if (ket.includes("policy brief") || ket.includes("policy paper") || ket.includes("laporan") || ket.includes("pb")) {
    return "Penyusunan PB/Laporan";
  }
  if (ket.includes("belum selesai") || ket.length > 5) {
    return "Dalam Proses";
  }
  
  const hasLinks = item.web_lan || item.web_unit || item.ig_lan || item.ig_unit || item.yt_lan || item.yt_unit || item.jurnal || item.media_online;
  if (hasLinks && (String(item.tahun) === "2025" || String(item.jadwal).includes("2025"))) {
    return "Selesai Publikasi";
  }
  if (hasLinks) {
    return "Selesai Publikasi";
  }
  
  return "Belum Dimulai";
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
