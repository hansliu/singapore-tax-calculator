const messages = {
    "en": {
        "intro": {
            "content": "Welcome to the Singapore Tax Calculator. This website has been made for you to quickly get an idea of the amount of taxes you might have to pay especially for the work visa holders. Refer to Singapore IRAS to know exactly how taxation works for you. Please feel free to leave the comments below at the bottom of this page. As of {average_year}, the average salary a year in Singapore is {average_salary}.",
            "average_year": "2022",
            "average_salary": "S$75,384"
        },
        "salary": {
            "title": "How much do you make {ayear}? {expenses}",
            "ayear": "a year",
            "expenses": "(after expenses, if any)",
            "net_income": "Your net income is:"
        },
        "about": {
            "title": "About the {website}",
            "content": "The Singapore Tax Calculatior is maintained by {author}. It was refer the {thanks_website} UI design and code base (that was maintained by {thanks_author} and Emi). If you find errors in those calculations, feel free to look into the code. It is being kept as simple as possible. If more changes need to be made, please feel free to create issue or pull request via {github}."
        },
        "disclaimer": {
            "title": "Disclaimer",
            "content": "All the information on the Singapore Tax Calculator (website) is published for general information purpose only. the website does not make any warranties about the completeness, reliability, and accuracy of this information. Any action you take upon the information you find on this website is strictly at your own risk. We will not be liable for any losses and/or damages in connection with the use of our website."
        }
    },
    "zh-tw": {
        "intro": {
            "content": "歡迎來到 Singapore Tax Calculator。本網站是為了讓想來新加坡工作或是已經在新加坡工作的工作簽證持有者，能快速瞭解你需要繳交多少個人所得稅。如果想知道更詳細的稅務資訊，請參考新加坡 IRAS 網站。如果對網站有什麼想法，也歡迎到最下方留言區留下你的意見。此外，根據統計，{average_year}年新加坡的平均年收入為 {average_salary}。",
            "average_year": "2022",
            "average_salary": "S$75,384"
        },
        "salary": {
            "title": "你{ayear}的收入是多少? {expenses}",
            "ayear": "一年",
            "expenses": "(扣除報帳減免)",
            "net_income": "你的稅後淨收入是:"
        },
        "about": {
            "title": "關於 {website}",
            "content": "Singapore Tax Calculator 網站由 {author} 開發與維護。網站的頁面設計與程式碼參考自 {thanks_website} (由 {thanks_author} 和 Emi 開發與維護)，如果有任何計算上的錯誤，歡迎你直接檢查程式碼。如果有什麼新想法，在維持盡可能簡單的設計原則下，也歡迎到 {github} 提出建議或請求。"
        },
        "disclaimer": {
            "title": "免責聲明",
            "content": "Singapore Tax Calculator 網站上的所有資訊僅供參考。該網站對本資訊的完整性，可靠性和準確性不做任何保證。您對在本網站上找到的資訊採取的任何措施均完全由您自擔風險。對於因使用我們的網站而引起的任何損失或損害，我們概不負責。"
        }
    },
    "zh-cn": {
        "intro": {
            "content": "欢迎来到 Singapore Tax Calculator。本网站是为了让想来新加坡做工或是已经在新加坡做工的工签持有者，能快速了解你需要缴交多少个人所得税。如果想知道更详细的税务资讯，请参考新加坡 IRAS 网站。如果对网站有什么想法，也欢迎到最下方留言区留下你的意见。此外，根据统计，{average_year}年新加坡的平均年收入为 {average_salary}。",
            "average_year": "2022",
            "average_salary": "S$75,384"
        },
        "salary": {
            "title": "你{ayear}的收入是多少? {expenses}",
            "ayear": "一年",
            "expenses": "(扣除公帐减免)",
            "net_income": "你的税后净收入是:"
        },
        "about": {
            "title": "关于 {website}",
            "content": "Singapore Tax Calculator 网站由 {author} 开发与维护。网站的页面设计与代码参考自 {thanks_website} (由 {thanks_author} 和 Emi 开发与维护)，如果有任何计算上的错误，欢迎你直接检查代码。如果有什么新想法，在维持尽可能简单的设计原则下，也欢迎到 {github} 提出建议或请求。"
        },
        "disclaimer": {
            "title": "免责声明",
            "content": "Singapore Tax Calculator 网站上的所有信息仅供参考。该网站对本信息的完整性，可靠性和准确性不做任何保证。您对在本网站上找到的信息采取的任何措施均完全由您自担风险。 对于因使用我们的网站而引起的任何损失和/或损害，我们概不负责。"
        }
    }
}

const locale = (navigator.language || navigator.browserLanguage).toLowerCase();

const i18n = new VueI18n({
    locale: (locale == 'zh-tw' || locale == 'zh-cn') ? locale : 'en',
    messages: messages,
})

var app = new Vue({
    el: '#wrapper',

    i18n: i18n,

    data: {

        // USER ENTRIES
        uiSalary: 75400,
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
                var now = new Date();
                var cpfCeiling = 6800 * 12;
                var cpfCeilingFrom2025 = 7400 * 12;
                var cpfCeilingFrom2026 = 8000 * 12;
                if (now > Date('2026-01-01T00:00:00')) {
                    cpfCeiling = cpfCeilingFrom2026;
                } else if (now > Date('2025-01-01T00:00:00')){
                    cpfCeiling = cpfCeilingFrom2025;
                }

                if (taxableIncome > cpfCeiling) {
                    this.cpfWithholdAmount = cpfCeiling * 0.2;
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

            if (taxableIncome >= 1000000) {
                this.incomeTaxAmount = (taxableIncome - 1000000) * 0.24 + 199150;
            }
            else if (taxableIncome >= 500000) {
                this.incomeTaxAmount = (taxableIncome - 500000) * 0.23 + 44550;
            }
            else if (taxableIncome >= 320000) {
                this.incomeTaxAmount = (taxableIncome - 320000) * 0.20 + 44550;
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
