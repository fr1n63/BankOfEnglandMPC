/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 14/07/2011
 * Time: 11:40
 * To change this template use File | Settings | File Templates.
 */

Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};