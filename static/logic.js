d3.csv("./data/Healthcare_CleanSet.csv").then(function(data) {
    // Extract medical conditions data
    let medical_conditions = new Set(data.map(function(d) {
        return d['Medical Condition'];
    }));

    // Append options to the dropdown
    medical_conditions.forEach(condition => {
        d3.select('select').append('option').text(condition);
    });

    // Call optionChanged with the first medical condition
    optionChanged([...medical_conditions][0]);

    

    // Group data by 'Medical Condition' and calculate average 'Billing Amount'
    let groupedData = data.reduce(function(acc, d) {
        let medicalCondition = d['Medical Condition'];
        let billingAmount = parseFloat(d['Billing Amount']);

        if (!acc[medicalCondition]) {
            acc[medicalCondition] = { sum: 0, count: 0 };
        }

        acc[medicalCondition].sum += billingAmount;
        acc[medicalCondition].count++;
        return acc;
    }, {});

    // Calculate average billing amounts
    let avgBillingAmounts = Object.keys(groupedData).map(function(key) {
        return {
            medicalCondition: key,
            avgBillingAmount: groupedData[key].sum / groupedData[key].count
        };
    });

    // Process data for the pie chart
    let groupedDataPie = data.reduce(function(acc, d) {
        let admissionType = d['Admission Type'];
        let billingAmountPie = parseFloat(d['Billing Amount']);
        if (!acc[admissionType]) {
            acc[admissionType] = { sum: 0, count: 0 };
        }
        acc[admissionType].sum += billingAmountPie;
        acc[admissionType].count++;
        return acc;
    }, {});
    let avgBillingAmountsPie = Object.keys(groupedDataPie).map(function(type) {
        let avgBillingAmount = groupedDataPie[type].sum / groupedDataPie[type].count;
        return {
            admissionType: type,
            avgBillingAmountPie: avgBillingAmount.toFixed(2)
        };
    });
    // Create bar chart
    createBarChart(avgBillingAmounts);
    // Create pie chart
    createPieChart(avgBillingAmountsPie);
    // Create bubble chart
    createBubbleChart(data);
});
function createBarChart(data) {
    let medicalConditions = data.map(d => d.medicalCondition);
    let avgBillingAmounts = data.map(d => d.avgBillingAmount);
    let trace = {
        x: medicalConditions,
        y: avgBillingAmounts,
        type: 'bar',
        marker: {
            color: 'rgba(54, 162, 235, 0.5)'
        }
    };
    let layout = {
        title: 'Average Billing Amount per Medical Condition',
        xaxis: {
            title: 'Medical Condition'
        },
        yaxis: {
            title: 'Average Billing Amount ($)'
        }
    };
    Plotly.newPlot('bar', [trace], layout);
}
function createPieChart(data) {
    let labels = data.map(item => item.admissionType);
    let values = data.map(item => item.avgBillingAmountPie);
    let trace = {
        labels: labels,
        values: values,
        type: 'pie'
    };
    let layout = {
        title: 'Average Billing Amounts by Admission Type'
    };
    Plotly.newPlot('pie-chart', [trace], layout);
}

function createBubbleChart(data) {
    // Extract data for the bubble chart
    let age = data.map(d => d['Age']);
    let gender = data.map(d => d['Gender']);
    let bloodType = data.map(d => d['Blood Type']);
    let medicalCondition = data.map(d => d['Medical Condition']);

    // Get unique medical conditions
    let uniqueMedicalConditions = [...new Set(medicalCondition)];

    // Create trace for the bubble chart
    var trace1 = {
        x: age,
        y: gender,
        text: bloodType,
        mode: 'markers',
        marker:  { 
            color: medicalCondition.map(condition => uniqueMedicalConditions.indexOf(condition)), 
            size: age,
            colorscale: 'Earth',
            colorbar: {
                title: 'Medical Condition',
                tickvals: uniqueMedicalConditions.map((_, index) => index), // Map color indices to medical condition names
                ticktext: uniqueMedicalConditions
            }
        }
    };

    // Define data array containing the trace
    var bubbleData = [trace1];

    // Define layout for the bubble chart
    var layout = {
        title: '', 
        showlegend: false,
        xaxis: {title: "Age"}
    };

    // Plot the bubble chart using Plotly
    Plotly.newPlot('bubble', bubbleData, layout);
}


const optionChanged = condition => {
    d3.csv("./data/Healthcare_CleanSet.csv").then(data=> {
        let med = data.filter(d => d['Medical Condition'] === condition);
        
    });
};

