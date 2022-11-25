function datetime() {
  let dateObj = new Date();
  let hhr = dateObj.getHours() || 12;
  let monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม.",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  let parts = {
    date: dateObj.getDate().toString().padStart(2, "0"),
    month: monthNames[dateObj.getMonth()],
    year: dateObj.getFullYear() + 543,
    hour: hhr.toString().padStart(2, "0"),
    minute: dateObj.getMinutes().toString().padStart(2, "0"),
    amOrPm: dateObj.getHours() < 12 ? "AM" : "PM",
  };
  return `${parts.date} ${parts.month} ${parts.year} ${parts.hour}:${parts.minute} น. ${parts.amOrPm}`;
}

export default datetime;
