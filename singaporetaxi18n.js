import { messages } from './i18n.js';

const locale = (navigator.language || navigator.browserLanguage).toLowerCase();

const i18n = new VueI18n({
    locale: (locale == 'zh-tw' || locale == 'zh-cn') ? locale : locale.split('-')[0],
    messages: messages,
})

var app = new Vue({
    el: '#wrapper',

    i18n: i18n,

    data: {

        // USER ENTRIES
        uiSalary: 54700,
        salary: 0,
        isPermanentResident: false,
        isNonResidents: false,

        // CALCULATIONS
        cpfWithholdAmount: 0,
        incomeTaxAmount: 0,
        incomeNet: 0,

        // PERCENT OF SALARY
        cpfWithholdPercent: 0,
        incomeTaxPercent: 0,
        incomeNetPercent: 0

    },

    mounted: function() {
        this.calculateAll();
    },

    watch: {

        isPermanentResident: function() {
            this.calculateAll();
        },
        isNonResidents: function() {
            this.calculateAll();
        },
        uiSalary: function(newSalary) {
            this.calculateAll();
        }

    },

    methods: {

        calculateAll: function() {
            this.salary = parseInt(this.uiSalary);
            this.taxableIncome = this.salary;
            this.calculateCpfWithholdAmount();
            this.calculateIncomeTaxAmount();
            this.calculateIncomeNet();
        },

        calculateCpfWithholdAmount: function() {
            var taxableIncome = this.taxableIncome;
            this.cpfWithholdAmount = 0;

            if (this.isPermanentResident) {
                if (taxableIncome > 72000) {
                    this.cpfWithholdAmount = 72000 * 0.2;
                }
                else {
                    this.cpfWithholdAmount = taxableIncome * 0.2;
                }
            }

            this.cpfWithholdPercent = Math.round(
                this.cpfWithholdAmount / this.salary * 100);
        },

        calculateIncomeTaxAmount: function() {
            var taxableIncome = this.taxableIncome - this.cpfWithholdAmount;
            this.incomeTaxAmount = 0;

            if (taxableIncome >= 320000) {
                this.incomeTaxAmount = (taxableIncome - 320000) * 0.22 + 44550;
            }
            else if (taxableIncome >= 280000) {
                this.incomeTaxAmount = (taxableIncome - 280000) * 0.20 + 36550;
            }
            else if (taxableIncome >= 240000) {
                this.incomeTaxAmount = (taxableIncome - 240000) * 0.195 + 28750;
            }
            else if (taxableIncome >= 200000) {
                this.incomeTaxAmount = (taxableIncome - 200000) * 0.19 + 21150;
            }
            else if (taxableIncome >= 160000) {
                this.incomeTaxAmount = (taxableIncome - 160000) * 0.18 + 13950;
            }
            else if (taxableIncome >= 120000) {
                this.incomeTaxAmount = (taxableIncome - 120000) * 0.15 + 7950;
            }
            else if (taxableIncome >= 80000) {
                this.incomeTaxAmount = (taxableIncome - 80000) * 0.115 + 3350;
            }
            else if (taxableIncome >= 40000) {
                this.incomeTaxAmount = (taxableIncome - 40000) * 0.07 + 550;
            }
            else if (taxableIncome >= 30000) {
                this.incomeTaxAmount = (taxableIncome - 30000) * 0.035 + 200;
            }
            else if (taxableIncome >= 20000) {
                this.incomeTaxAmount = (taxableIncome - 20000) * 0.02;
            }

            // 15% of gross income or 22% of net income
            if (this.isNonResidents) {
                if (taxableIncome * 0.15 > this.incomeTaxAmount) {
                    this.incomeTaxAmount = taxableIncome * 0.15
                }
            }

            this.incomeTaxPercent = Math.round(this.incomeTaxAmount / this.salary * 100);
        },

        calculateIncomeNet: function() {
            this.incomeNet = this.salary - this.cpfWithholdAmount - this.incomeTaxAmount;
            this.incomeNetPercent = Math.round(this.incomeNet / this.salary * 100);
            //console.debug("Income Net: ", this.incomeNet);
        },

    },

    filters: {

        toSGD: function(value) {
            if (!value)
                return 'S$0';
            var val = Math.round(value);
            return "S$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    }
})
