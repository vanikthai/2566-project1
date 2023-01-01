function datetime(Obj) {
  let dateObj = new Date(Obj);
  let monthNames = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  let yea = dateObj.getFullYear() + 543;
  let parts = {
    date: dateObj.getDate().toString().padStart(2, "0"),
    month: monthNames[dateObj.getMonth()],
    year: yea.toString().substring(1, 3),
  };
  return `${parts.date} ${parts.month}${parts.year}`;
}

export default datetime;
