$(function () {
    if (jQuery().multiselect) {
        $("select[multiple].js-multiselect").multiselect({
            header: true,
            selectedList: 10,
            create: function() {
                resizeFixedWorkarea();
            }
        });
    } else {
        console.log("jQuery multiselect widget could not be detected.");
    }
});