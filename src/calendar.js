/* eslint-disable */
function gregorianToJulian(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  var A = Math.floor(year / 100);
  var B = 2 - A + Math.floor(A / 4);
  var JD =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5;
  return JD;
}

function julianToPersian(jd) {
  jd = jd + 0.5;
  var Z = Math.floor(jd);
  var F = jd - Z;
  var A = Z;
  if (Z >= 2299161) {
    var alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1) / 365.25);
  var D = Math.floor(365.25 * C);
  var E = Math.floor((B - D) / 30.6001);
  var day = B - D - Math.floor(30.6001 * E) + F;
  var month = E < 14 ? E - 1 : E - 13;
  var year = month > 2 ? C - 4716 : C - 4715;

  return gregorianToJalali(year, month, day);
}

function julianToGregorian(jd) {
  jd = jd + 0.5;
  var Z = Math.floor(jd);
  var F = jd - Z;
  var A = Z;
  if (Z >= 2299161) {
    var alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1) / 365.25);
  var D = Math.floor(365.25 * C);
  var E = Math.floor((B - D) / 30.6001);
  var day = B - D - Math.floor(30.6001 * E) + F;
  var month = E < 14 ? E - 1 : E - 13;
  var year = month > 2 ? C - 4716 : C - 4715;

  return [Math.floor(year), Math.floor(month), Math.floor(day)];
}
function persianToJulian(jy, jm, jd) {
  var g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  function div(a, b) {
    return Math.floor(a / b);
  }

  jy -= 979;
  var j_day_no = 365 * jy + div(jy, 33) * 8 + div((jy % 33) + 3, 4);
  for (var i = 0; i < jm - 1; ++i) {
    j_day_no += j_days_in_month[i];
  }
  j_day_no += jd - 1;

  var g_day_no = j_day_no + 79;

  var gy = 1600 + 400 * div(g_day_no, 146097);
  g_day_no = g_day_no % 146097;

  var leap = true;
  if (g_day_no >= 36525) {
    g_day_no--;
    gy += 100 * div(g_day_no, 36524);
    g_day_no = g_day_no % 36524;

    if (g_day_no >= 365) {
      g_day_no++;
    } else {
      leap = false;
    }
  }

  gy += 4 * div(g_day_no, 1461);
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;
    g_day_no--;
    gy += div(g_day_no, 365);
    g_day_no = g_day_no % 365;
  }

  for (i = 0; g_day_no >= g_days_in_month[i] + (i == 1 && leap); i++) {
    g_day_no -= g_days_in_month[i] + (i == 1 && leap);
  }
  var gm = i + 1;
  var gd = g_day_no + 1;

  return gregorianToJulian(gy, gm, gd);
}
function gregorianToJalali(gYear, gMonth, gDay) {
  var g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  function div(a, b) {
    return Math.floor(a / b);
  }

  var gy = gYear - 1600;
  var gm = gMonth - 1;
  var gd = gDay - 1;

  var g_day_no =
    365 * gy + div(gy + 3, 4) - div(gy + 99, 100) + div(gy + 399, 400);
  for (var i = 0; i < gm; ++i) g_day_no += g_days_in_month[i];
  if (gm > 1 && ((gYear % 4 == 0 && gYear % 100 != 0) || gYear % 400 == 0))
    g_day_no++;
  g_day_no += gd;

  var j_day_no = g_day_no - 79;

  var j_np = div(j_day_no, 12053);
  j_day_no %= 12053;

  var jy = 979 + 33 * j_np + 4 * div(j_day_no, 1461);
  j_day_no %= 1461;

  if (j_day_no >= 366) {
    jy += div(j_day_no - 1, 365);
    j_day_no = (j_day_no - 1) % 365;
  }

  for (var j = 0; j < 11 && j_day_no >= j_days_in_month[j]; ++j)
    j_day_no -= j_days_in_month[j];
  var jm = j + 1;
  var jd = j_day_no + 1;
  return [jy, jm, jd];
}
export default {
  J: (y, m, d) => julianToPersian(gregorianToJulian(y, m, d)),
  G: (y, m, d) => julianToGregorian(persianToJulian(y, m, d)),
};
