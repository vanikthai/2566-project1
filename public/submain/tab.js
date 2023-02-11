export default class TAB {
  constructor() {
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.tab = document.getElementsByClassName("tab");
    this.step = document.getElementsByClassName("step");
    this.currentTab = 0;
  }
  showTab(index) {
    this.tab[index].style.display = "block";
    if (index == 0) {
      this.prevBtn.style.display = "none";
    } else {
      this.prevBtn.style.display = "inline";
    }
    if (index == this.tab.length - 1) {
      this.nextBtn.innerHTML = "สิ้นสุด";
    } else {
      this.nextBtn.innerHTML = "ต่อไป";
    }
    this.fixStepIndicator(index);
  }
  nextPrev(index) {
    this.tab[this.currentTab].style.display = "none";
    this.currentTab = this.currentTab + index;
    if (this.currentTab >= this.tab.length) {
      //if (this.currentTab === 3) btnUpdateDestrip();
      this.currentTab = 0;
      this.showTab(this.currentTab);
      // document.getElementById("regForm").submit();
      return false;
    }
    this.showTab(this.currentTab);
  }
  fixStepIndicator(index) {
    for (let i = 0; i < this.step.length; i++) {
      this.step[i].className = this.step[i].className.replace(" active", "");
    }
    this.step[index].className += " active";
  }
}
