// $(document).ready(function(){
//   $("#net_income").mask("9 999 999 999", { placeholder: " " } );
// });

var app = new Vue({
    el: '#wrapper',
    data: {

        // USER ENTRIES
        ui_salary: 67000,
        salary: 0,
        is_permanent_resident: false,
        is_non_residents: false,

        // CALCULATIONS
        income_tax_amount: 0,
        income_net: 0,

        // PERCENT OF SALARY
        income_tax_percent: 0,
        income_net_percent: 0
    },

    mounted: function() {
        this.calculate_all();
    },

    watch: {
        // is_permanent_resident: function() {
        //     this.calculate_all();
        // },
        is_non_residents: function() {
            this.calculate_all();
        },
        ui_salary: function(newSalary) {
            this.calculate_all();
        }
    },
    methods: {

        calculate_all: function() {
            this.salary = parseInt(this.ui_salary);
            this.taxable_income = this.salary;
            this.calculate_income_tax_amount();
            this.calculate_income_net();
        },

        calculate_income_tax_amount: function() {
            var taxable_income = this.taxable_income;
            this.income_tax_amount = 0;

            if (taxable_income >= 320000) {
                this.income_tax_amount = (taxable_income - 320000) * 0.22 + 44550;
            }
            else if (taxable_income >= 280000) {
                this.income_tax_amount = (taxable_income - 280000) * 0.20 + 36550;
            }
            else if (taxable_income >= 240000) {
                this.income_tax_amount = (taxable_income - 240000) * 0.195 + 28750;
            }
            else if (taxable_income >= 200000) {
                this.income_tax_amount = (taxable_income - 200000) * 0.19 + 21150;
            }
            else if (taxable_income >= 160000) {
                this.income_tax_amount = (taxable_income - 160000) * 0.18 + 13950;
            }
            else if (taxable_income >= 120000) {
                this.income_tax_amount = (taxable_income - 120000) * 0.15 + 7950;
            }
            else if (taxable_income >= 80000) {
                this.income_tax_amount = (taxable_income - 80000) * 0.115 + 3350;
            }
            else if (taxable_income >= 40000) {
                this.income_tax_amount = (taxable_income - 40000) * 0.07 + 550;
            }
            else if (taxable_income >= 30000) {
                this.income_tax_amount = (taxable_income - 30000) * 0.035 + 200;
            }
            else if (taxable_income >= 20000) {
                this.income_tax_amount = (taxable_income - 20000) * 0.02;
            }

            // 15% of gross income or 22% of net income
            if (this.is_non_residents) {
                if (taxable_income * 0.15 > this.income_tax_amount) {
                    this.income_tax_amount = taxable_income * 0.15
                }
            }

            this.income_tax_percent = Math.round(this.income_tax_amount / this.salary * 100);
        },

        calculate_income_net: function() {
            this.income_net = this.salary - this.income_tax_amount;
            this.income_net_percent = Math.round(this.income_net / this.salary * 100);
            //console.debug("Income Net: ", this.income_net);
        },

    },

    filters: {

        to_sgd: function(value) {
            if (!value)
            return 'S$0';
            var val = Math.round(value);
            return "S$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    }
})
