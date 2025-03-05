document.addEventListener('DOMContentLoaded', function() {
  fetch('http://localhost:3003/data')
    .then(response => response.json())
    .then(data => {
      const timestamps = data.map(item => item.Timestamp);
      const defectiveData = data.map(item => item.Defective);
      const coverData = data.map(item => item.Cover);
      const flavourData = data.reduce((acc, item) => acc + item.Flavour, 0);
      const shapeData = data.reduce((acc, item) => acc + item.Shape, 0);
      const statusCounts = {
        defective: data.filter(item => item.Status === 1).length,
        nonDefective: data.filter(item => item.Status === 0).length
      };

      const lineChart = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
          labels: timestamps,
          datasets: [{
            label: 'Defective',
            data: defectiveData,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
          }]
        }
      });

      const barChart = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
          labels: timestamps,
          datasets: [{
            label: 'Cover',
            data: coverData,
            backgroundColor: 'rgba(153,102,255,0.6)',
          }]
        }
      });

      const pieChart = new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
          labels: ['Flavour', 'Shape'],
          datasets: [{
            data: [flavourData, shapeData],
            backgroundColor: ['rgba(255,99,132,0.6)', 'rgba(54,162,235,0.6)'],
          }]
        }
      });

      const statusChart = new Chart(document.getElementById('statusChart'), {
        type: 'doughnut',
        data: {
          labels: ['Defective', 'Non-Defective'],
          datasets: [{
            data: [statusCounts.defective, statusCounts.nonDefective],
            backgroundColor: ['rgba(255,99,132,0.6)', 'rgba(75,192,192,0.6)'],
          }]
        }
      });

      function updateCharts(selectedTimestamp) {
        const filteredData = data.filter(item => item.Timestamp === selectedTimestamp);
        if (filteredData.length > 0) {
          const selectedData = filteredData[0];
          lineChart.data.datasets[0].data = [selectedData.Defective];
          barChart.data.datasets[0].data = [selectedData.Cover];
          pieChart.data.datasets[0].data = [selectedData.Flavour, selectedData.Shape];
          lineChart.update();
          barChart.update();
          pieChart.update();
        }
      }

      document.getElementById('lineChart').onclick = function(evt) {
        const activePoints = lineChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
        if (activePoints.length > 0) {
          const index = activePoints[0].index;
          const selectedTimestamp = timestamps[index];
          updateCharts(selectedTimestamp);
        }
      };

      document.getElementById('barChart').onclick = function(evt) {
        const activePoints = barChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
        if (activePoints.length > 0) {
          const index = activePoints[0].index;
          const selectedTimestamp = timestamps[index];
          updateCharts(selectedTimestamp);
        }
      };
    })
    .catch(error => console.error('Error fetching data:', error));
});
