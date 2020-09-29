<template>
    <div id="app">
        <div class="calc">
            <div class="calc-display">
                <div class="content" v-if="display == 'NaN'">Fout</div>
                <div class="content" v-else>{{ content }}</div>
            </div>
            <div class="calc-btns">
                <button v-for="(button, index) in buttons" :key="index" :class="button.class" :id="button.id" @click.prevent="getFunction(button.click, button.param)" class="calc-btn">
                    <span v-html="button.content"></span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    name: 'App',

    data () {
        return {
            current: 0,
            operator: null,
            display: '0',
            total: 0,

            buttons: [
                { class: '', id: 'clear-btn', click: 'handleClearInput', param: '', content: 'AC' },
                { class: '', id: 'change-btn', click: 'handleChange', param: '', content: '<sup id="change-plus">+</sup>⁄<sub id="change-minus">-</sub>' },
                { class: '', id: 'percentage-btn', click: 'handlePercentage', param: '', content: '%' },
                { class: 'operator-btn', id: 'divide-btn', click: 'handleClickOperator', param: '/', content: '÷' },
                { class: 'digit-btn', id: '', click: 'handleClickDigit', param: 7, content: '7' },
                { class: 'digit-btn', id: '', click: 'handleClickDigit', param: 8, content: '8' },
                { class: 'digit-btn', id: '', click: 'handleClickDigit', param: 9, content: '9' },
                { class: 'operator-btn', id: 'times-btn', click: 'handleClickOperator', param: '*', content: '&times;' },
                { class: 'digit-btn', id: '', click: 'handleClickDigit', param: 4, content: '4' },
                { class: 'digit-btn', id: '', click: 'handleClickDigit', param: 5, content: '5' },
                { class: 'digit-btn', id: '', click: 'handleClickDigit', param: 6, content: '6' },
                { class: 'operator-btn', id: 'minus-btn', click: 'handleClickOperator', param: '-', content: '-' },
                { class: 'digit-btn', id: '', click: 'handleClickDigit', param: 1, content: '1' },
                { class: 'digit-btn', id: '', click: 'handleClickDigit', param: 2, content: '2' },
                { class: 'digit-btn', id: '', click: 'handleClickDigit', param: 3, content: '3' },
                { class: 'operator-btn', id: 'plus-btn', click: 'handleClickOperator', param: '+', content: '+' },
                { class: 'digit-btn', id: 'zero-btn', click: 'handleClickDigit', param: 0, content: '<span style="margin-left: 23px">0</span>' },
                { class: '', id: 'comma-btn', click: 'handleClickDigit', param: '.', content: '.' },
                { class: 'equals-btn', id: 'equals-btn', click: 'handleEquals', param: '', content: '=' },
            ]
        }
    },

    watch: {
        'display' () {
            if(this.display.length < 7)
                $(".calc-display").css('font-size', '')

            if(this.display.length == 7)
                $(".calc-display").css('font-size', '65px')

            if(this.display.length == 8)
                $(".calc-display").css('font-size', '59px')

            if(this.display.length == 9)
                $(".calc-display").css('font-size', '53px')

            if(this.display.length >= 10)
                $(".calc-display").css('font-size', '47px')
        }
    },

    computed: {

        /**
         * Get function to use in the @click.
         */
        getFunction () {
            return (fn, param) => this[fn](param)
        },

        /**
         * Format the display content nicely.
         */
        content () {
            let parts = this.display.replace('.', ',').split(',')
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")

            return parts.join(',')
        }

    },

    methods: {

        /**
         * Add the correct items to the display.
         */
        handleClickDigit (digit) {
            $('#clear-btn span').text('C')

            if(this.display.length >= 9 ||
            (this.display == '0.0' && digit == 0) ||
            (this.display.includes('.') && digit == '.'))
                return

            if(!this.current) {
                if(digit == '.') {
                    this.current = '0.'
                    this.display = '0.'
                } else {
                    this.current = digit
                    this.display = digit.toString()
                }
            } else {
                if(digit == '.' || this.display.includes('.')) {
                    if (this.current.toString().indexOf('.') == -1) {
                        this.current = parseFloat(this.current.toString() + '.' + digit.toString());
                    } else {
                        this.current += digit.toString()
                        this.current = parseFloat(this.current)
                    }
                } else {
                    this.current *= 10
                    this.current += digit
                }
                this.display += digit.toString()
            }

        },

        /**
         * Set the operator.
         */
        handleClickOperator (operator) {
            if(!this.total && this.operator == operator)
                return

            if(!this.total)
                this.total = this.current

            this.current = 0
            this.operator = operator
        },

        /**
         * The percentage button.
         */
        handlePercentage () {
            if(this.current) {
                this.current /= 100

                this.checkScientificNotation()

                this.display = parseFloat(this.current).toString()
            } else {
                this.total /= 100

                this.checkScientificNotation()

                this.display = parseFloat(this.total).toString()
            }
        },

        /**
         * Execute the math query.
         */
        handleEquals () {
            if(!this.total)
                return

            if(!this.current)
                this.current = this.total

            this.total = parseFloat(this.total)

            switch (this.operator) {
                case '+':
                    this.total += this.current
                    break
                case '-':
                    this.total -= this.current
                    break
                case '*':
                    this.total *= this.current
                    break
                case '/':
                    this.total /= this.current
                    break
            }


            this.display = parseFloat(this.total).toString()

            if(this.display.includes('.')) {
                let parts = this.display.split('.')
                this.display = parseFloat(parseFloat(this.display).toPrecision(6)).toString()
            }

            this.checkScientificNotation()
        },

        /**
         * Toggle the negative state of the number.
         */
        handleChange () {
            if(this.total) {
                this.total = this.total - (this.total * 2)
                this.display = parseFloat(this.total).toString()
            } else {
                this.current = this.current - (this.current * 2)
                this.display = parseFloat(this.current).toString()
            }
        },

        /**
         * Check if we need to change the value to scientific notation.
         */
        checkScientificNotation () {
            if(this.display.length >= 9) {
                this.total = parseFloat(parseFloat(this.total).toExponential()).toPrecision(6)
                this.display = this.total
            }
        },

        /**
         * Clear the display input.
         */
        handleClearInput () {
            this.reset()
        },

        /**
         * Reset all.
         */
        reset () {
            this.current = 0
            this.display = '0'
            this.total = 0
            this.operator = null
            $('#clear-btn span').text('AC')
            $(".calc-display").css('font-size', '')
        },

    },

}
</script>

<style>
/**
 * App styling
 */
html, body {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    background: black;
}
#app {
    margin: 20px auto 0;
    height: 650px;
    width: 350px;
}

/**
 * Calculator styling.
 */
.calc-display {
    height: 75px;
    width: 350px;
    font-size: 75px;
    margin-bottom: 25px;
}
.calc-display .content {
    color: white;
    position: relative;
    text-align: right;
    right: 10%;
}

/**
 * Button styling
 */
#change-plus {
    top: -6px;
}
#change-minus {
    font-size: 30px;
    bottom: -5px;
    margin-left: -2px;
}
#change-btn {
    background-color: #D6D6D6;
    color: black;
}
#zero-btn {
    width: 155px;
    border-radius: 25%/50%;
    text-align: left;
}
.calc-btns {
    display: grid;
    grid-template-columns: 85px 85px 85px 85px;
    grid-template-rows: 20%;
}
.calc-btn {
    font-weight: 500;
    width: 70px;
    height: 70px;
    background: #D6D6D6;
    font-size: 1.5rem;
    border: none;
    margin: 5px;
    border-radius: 50%;
    transition: 0.4s ease-in;
}
.operator-btn:focus {
    background: #ffffff !important;
    color: #FF9600 !important;
}
.calc-btn:active {
    box-shadow: inset 0 0 65px white;
    transition: 0s ease-out;
}
.digit-btn, #comma-btn {
    color: white;
    background: #353535;
    font-size: 25px;
}
.operator-btn, .equals-btn {
    font-size: 2rem;
    color: white;
    background: #FF9600;
}
.calc-btn:focus {
    outline: none;
}
#comma-btn {
    margin-left: 90px;
}
#equals-btn {
    margin-left: 90px;
}
</style>
