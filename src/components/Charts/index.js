import React from "react";
import { Line, Pie } from "@ant-design/charts";

function ChartComponent({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  const spendingData = sortedTransactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const finalSpendings = spendingData.reduce((acc, obj) => {
    const key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: key, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  const newSpendings = [
    { tag: "food", amount: finalSpendings.food?.amount || 0 },
    { tag: "education", amount: finalSpendings.education?.amount || 0 },
    { tag: "office", amount: finalSpendings.office?.amount || 0 },
  ];

  const config = {
    data,
    width: 500,
    height: 400,
    autoFit: false,
    xField: "date",
    yField: "amount",
  };

  const spendingConfig = {
    data: newSpendings,
    width: 500,
    height: 400,
    angleField: "amount",
    colorField: "tag",
  };

  return (
    <div className="charts-wrapper">
      <div className="chart-box">
        <h1 style={{ marginTop: 0 }}>Your Analytics</h1>
        <Line {...config} />
      </div>

      <div className="chart-box">
        <h1>Your Spendings</h1>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
}

export default ChartComponent;
