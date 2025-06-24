import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';
import ReturnsChart from '../components/chart';
import InfoCard from '../components/card';
import FundsInputTable from '../components/input-table';
import InputField from '../components/input-field';
import { calculateReturns, validateInputs } from '../utils/finance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background: #1e293b;
    color: #e2e8f0;
    border: 1px solid #334155;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    font-family: inherit;
    font-size: 20px;
    min-height: 64px;
    width: 400px;
    max-width: calc(100vw - 60px);
  }

  .Toastify__toast-body {
    padding: 16px;
    color: #e2e8f0;
    font-family: inherit;
  }

  .Toastify__toast--success {
    border-left: 4px solid #10b981;
  }

  .Toastify__toast--error {
    border-left: 4px solid #ef4444;
  }

  .Toastify__toast--info {
    border-left: 4px solid #3b82f6;
  }

  .Toastify__toast--warning {
    border-left: 4px solid #f59e0b;
  }

  .Toastify__close-button {
    color: #94a3b8;
    opacity: 0.7;
  }

  .Toastify__close-button:hover {
    opacity: 1;
  }

  .Toastify__progress-bar {
    background: #334155;
  }

  .Toastify__progress-bar--success {
    background: #10b981;
  }

  .Toastify__progress-bar--error {
    background: #ef4444;
  }

  .Toastify__progress-bar--info {
    background: #3b82f6;
  }

  .Toastify__progress-bar--warning {
    background: #f59e0b;
  }
`;

const ReturnCalc = ({ location }) => {
  const [monthlyPremium, setMonthlyPremium] = useState('500');
  const [startDate, setStartDate] = useState('2022-01-01');

  const [averageFeesFA, setAverageFeesFA] = useState(0);
  const [averageFeesBenchmark, setAverageFeesBenchmark] = useState(0);

  const [chartDataFA, setChartDataFA] = useState([]);
  const [chartDataBenchmark, setChartDataBenchmark] = useState([]);

  const [faData, setFaData] = useState([
    { id: 1, name: 'Fundsmith Equity Fund Acc GBP', allocation: '20', fees: '1.04', annualReturn: '13.18' },
    { id: 2, name: 'Infinity US 500 Stock Index Fund Acc SGD', allocation: '30', fees: '0.61', annualReturn: '11.1' },
    { id: 3, name: 'Nikko AM Japan Dividend Equity Fund Dis SGD-H', allocation: '15', fees: '1.5', annualReturn: '9.2' },
    { id: 4, name: 'FSSA Regional India Fund Acc SGD', allocation: '15', fees: '1.75', annualReturn: '8.69' },
    { id: 5, name: 'Guinness Global Equity Income Fund Dis USD', allocation: '10', fees: '1.27', annualReturn: '14.66' },
    { id: 6, name: 'Guinness Global Innovators Fund Acc USD', allocation: '10', fees: '1.84', annualReturn: '20.93' },
    { id: 7, name: 'Advisory Fee', allocation: '100', fees: '1', annualReturn: '0' },
  ]);

  const [benchmarkData, setBenchmarkData] = useState([
    { id: 1, name: 'Vanguard S&P 500 ETF', allocation: '100', fees: '0.03', annualReturn: '12.81' },
  ]);

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = () => {
    const {isValid, errors} = validateInputs(monthlyPremium, startDate, faData, benchmarkData)
    console.log(isValid)
    if (!isValid) {
      Object.values(errors).forEach(err => toast.error(err));
      return;
    }
    const averageReturnsFA = faData.reduce((acc, fund) => acc + fund.annualReturn*fund.allocation/100, 0)/100
    const averageFeesFA = faData.reduce((acc, fund) => acc + fund.fees*fund.allocation/100, 0)/100
    
    const averageFeesBenchmark = benchmarkData.reduce((acc, fund) => acc + fund.fees*fund.allocation/100, 0)/100
    const averageReturnsBenchmark = benchmarkData.reduce((acc, fund) => acc + fund.annualReturn*fund.allocation/100, 0)/100

    const chartDataFA = calculateReturns(new Date(startDate), monthlyPremium, averageReturnsFA, averageFeesFA, 30);
    const chartDataBenchmark = calculateReturns(new Date(startDate), monthlyPremium, averageReturnsBenchmark, averageFeesBenchmark, 30);

    setChartDataFA(chartDataFA);
    setChartDataBenchmark(chartDataBenchmark);

    setAverageFeesFA(averageFeesFA);
    setAverageFeesBenchmark(averageFeesBenchmark);
  };

  return (
    <Layout location={location}>
      <StyledMainContainer>
        <h1>ILP Returns Calculator</h1>
        <p>A calculator to see how much money you're losing from your ILP. The math behind this calculator will be explained below soon.</p>
        
        <StyledToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        <CardsContainer>
          <InfoCard 
            title="Total Fees (% p.a.)" 
            value={((averageFeesFA - averageFeesBenchmark)*100).toFixed(2)} 
            trend={(averageFeesFA - averageFeesBenchmark) >= 0 ? 'up' : 'down'} 
            mainValue={(averageFeesFA*100).toFixed(2)} 
            sub1={`Fees are ${((averageFeesFA - averageFeesBenchmark) * 100).toFixed(2)}% ${((averageFeesFA - averageFeesBenchmark) >= 0 ? 'higher' : 'lower')} than the benchmark`}
            sub2={`Benchmark Fees (% p.a.): ${(averageFeesBenchmark * 100).toFixed(2)}`}
          />
        </CardsContainer>

        <ReturnsChart strategyData={chartDataFA} benchmarkData={chartDataBenchmark}/>

        <div style={{ 
          display: 'flex', 
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <InputField
              label="Monthly Premium ($)"
              placeholder="Enter amount"
              value={monthlyPremium}
              onChange={(e) => setMonthlyPremium(e.target.value)}
            />
          </div>

          <div style={{ flex: '1', minWidth: '250px' }}>
            <InputField
              label="Start Date (YYYY-MM-DD)"
              placeholder="Enter start date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <FundsInputTable 
          faData={faData} 
          setFaData={setFaData} 
          benchmarkData={benchmarkData} 
          setbenchmarkData={setBenchmarkData} 
          buttonSubmit={handleSubmit}
        />

      </StyledMainContainer>
    </Layout>
  );
}

ReturnCalc.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ReturnCalc;