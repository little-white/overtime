var excel = require('node-excel-export');
var styles = {
    headerDark: {
        fill: {
            fgColor: {
                rgb: 'FF000000'
            }
        },
        font: {
            color: {
                rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: true
        }
    },
    cellPink: {
        fill: {
            fgColor: {
                rgb: 'FFFFCCFF'
            }
        }
    },
    cellGreen: {
        fill: {
            fgColor: {
                rgb: 'FF00FF00'
            }
        }
    }
};

//Array of objects representing heading rows (very top) 
let heading = [
    ['工号', '姓名', '部门', '加班日期', '起始时间', '结束时间', '休息时间', '加班原因', '加班时间', '加班标准'] // <-- It can be only values 
];

//Here you specify the export structure 
var specification = {
    number: { // <- the key should match the actual data key 
        displayName: '工号', // <- Here you specify the column header 
        headerStyle: styles.headerDark, // <- Header style 
        cellStyle: function(value, row) { // <- style renderer function 
            // if the status is 1 then color in green else color in red 
            // Notice how we use another cell value to style the current one 
            return (row.status_id == 1) ? styles.cellGreen : { fill: { fgColor: { rgb: 'FFFF0000' } } }; // <- Inline cell style is possible  
        },
        width: 120 // <- width in pixels 
    },
    name: {
        displayName: '姓名',
        headerStyle: styles.headerDark,
        cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property 
            return (value == 1) ? 'Active' : 'Inactive';
        },
        width: '10' // <- width in chars (when the number is passed as string) 
    },
    department: {
        displayName: '部门',
        headerStyle: styles.headerDark,
        cellStyle: styles.cellPink, // <- Cell style 
        width: 220 // <- width in pixels 
    },
    date: {
        displayName: '加班日期',
        headerStyle: styles.headerDark,
        cellStyle: styles.cellPink, // <- Cell style 
        width: 220 // <- width in pixels 
    },
    start: {
        displayName: '起始时间',
        headerStyle: styles.headerDark,
        cellStyle: styles.cellPink, // <- Cell style 
        width: 220 // <- width in pixels 
    },
    end: {
        displayName: '结束时间',
        headerStyle: styles.headerDark,
        cellStyle: styles.cellPink, // <- Cell style 
        width: 220 // <- width in pixels 
    },
    rest: {
        displayName: '休息时间',
        headerStyle: styles.headerDark,
        cellStyle: styles.cellPink, // <- Cell style 
        width: 220 // <- width in pixels 
    },
    reason: {
        displayName: '加班原因',
        headerStyle: styles.headerDark,
        cellStyle: styles.cellPink, // <- Cell style 
        width: 220 // <- width in pixels 
    },
    length: {
        displayName: '加班时间',
        headerStyle: styles.headerDark,
        cellStyle: styles.cellPink, // <- Cell style 
        width: 220 // <- width in pixels 
    },
    level: {
        displayName: '加班标准',
        headerStyle: styles.headerDark,
        cellStyle: styles.cellPink, // <- Cell style 
        width: 220 // <- width in pixels 
    }
}

module.exports = function(data) {
    return excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report 
            {
                name: 'Sheet name', // <- Specify sheet name (optional) 
                // heading: heading, // <- Raw heading array (optional) 
                specification: specification, // <- Report specification 
                data: data // <-- Report data 
            }
        ]
    );
}
