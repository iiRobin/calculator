import Vue from 'vue'
import numeral from 'numeral'

/**
 * Format the given number.
 */
Vue.filter("formatNumber", function (value) {
    return numeral(value).format("0,0")
});
