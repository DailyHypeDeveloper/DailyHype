// // Name: Zay Yar Tun
// // Admin No: 2235035
// // Class: DIT/FT/2B/02

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { ErrorMessage, URL } from "@/enums/global-enums";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BarChart from "@/components/charts/bar-chart";
import CustomTable from "@/components/ui/table";
import { capitaliseWord, formatMoney } from "@/functions/formatter";
import { getAdminOrderMonthlyRevenueStat, getAdminOrderMonthlyRevenueStatDetail } from "@/functions/admin-order-functions";

const LineChart = dynamic(() => import("@/components/charts/line-chart"));
const PieChart = dynamic(() => import("@/components/charts/pie-chart"));

const yearOptions: number[] = [];
for (let i = 0; i < 10; i++) {
  yearOptions.push(new Date().getFullYear() - i);
}

const columns1 = ["UserID", "User Name", "Gender", "No of Orders", "Total Qty", "Total Amount"];
const columns2 = ["ProductID", "Product Name", "Category", "Colour", "Size", "Total Qty", "Total Amount", "Total Order"];

export default function MonthlyReport() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [chart, setChart] = useState<"bar" | "line" | "pie">("bar");
  const [tableData, setTableData] = useState<[string, ...React.ReactNode[]][]>([]);
  const [tableData2, setTableData2] = useState<[string, ...React.ReactNode[]][]>([]);
  const [tableDataCount, setTableDataCount] = useState<number>(1);
  const [tableDataCount2, setTableDataCount2] = useState<number>(1);
  const router = useRouter();

  const [data, setData] = useState([
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Male" },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Female" },
  ]);
  const [barChartData, setBarChartData] = useState([
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Male", backgroundColor: "rgba(255, 99, 132, 0.5)" },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Female", backgroundColor: "rgba(53, 162, 235, 0.5)" },
  ]);
  const [lineChartData, setLineChartData] = useState([
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Male", backgroundColor: "rgba(255, 99, 132, 0.5)", borderColor: "rgb(255, 99, 132)" },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Female", backgroundColor: "rgba(53, 162, 235, 0.5)", borderColor: "rgb(53, 162, 235)" },
  ]);
  const [pieChartData, setPieChartData] = useState([
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Male", backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"], borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"], borderWidth: 1 },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Female", backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"], borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"], borderWidth: 1 },
  ]);

  const generateTable = (month: string, gender: string, year: number) => {
    const tempMonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const tempMonth = tempMonthArr.indexOf(month) + 1;
    console.log(tempMonth);
    let tempGender: "m" | "f" = "f";
    if (gender === "Male") {
      tempGender = "m";
    }
    getAdminOrderMonthlyRevenueStatDetail(tempMonth, tempGender, year).then((result) => {
      if (result.error) {
      } else {
        console.log(result);
        const data = result.user || [];
        const product = result.product || [];
        setTableDataCount(result.user ? result.user.length : 1);
        setTableDataCount2(result.product ? result.product.length : 1);
        setTableData2(
          product.map((item, index) => {
            return [
              item.productid.toString(),
              <label key={index} className="text-[14px] flex justify-center text-center">
                {item.productname}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                {item.categoryname}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                {capitaliseWord(item.colourname)}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                {item.sizename}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                {item.totalqty}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                ${formatMoney(item.totalamount)}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                {item.totalorder}
              </label>,
            ];
          })
        );
        setTableData(
          data.map((item, index) => {
            return [
              item.userid.toString(),
              <label key={index} className="text-[14px] flex justify-center text-center">
                {item.name}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                {item.gender === "M" ? "Male" : "Female"}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                {item.totalorder}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                {item.totalqty}
              </label>,
              <label key={index} className="text-[14px] flex justify-center">
                ${formatMoney(item.totalamount)}
              </label>,
            ];
          })
        );
      }
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAdminOrderMonthlyRevenueStat(year).then((result) => {
        if (result.error) {
          if (result.error === ErrorMessage.UNAURHOTIZED) {
            alert(ErrorMessage.UNAURHOTIZED);
            router.push(URL.SignOut);
          }
        } else {
          const tempData = result.data || [];
          const tempData2 = [
            { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Male" },
            { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Female" },
          ];
          tempData.forEach((item) => {
            if (item.gender === "M") {
              tempData2[0].data[parseInt(item.month) - 1] = parseFloat(item.revenue);
            } else {
              tempData2[1].data[parseInt(item.month) - 1] = parseFloat(item.revenue);
            }
          });
          setData(tempData2);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [year]);

  useEffect(() => {
    if (chart === "bar") {
      setBarChartData(data.map((d) => ({ ...d, backgroundColor: d.label === "Male" ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)" })));
    } else if (chart === "pie") {
      setPieChartData(data.map((d) => ({ ...d, backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"], borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"], borderWidth: 1 })));
    } else {
      setLineChartData(data.map((d) => ({ ...d, backgroundColor: d.label === "Male" ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)", borderColor: d.label === "Male" ? "rgb(255, 99, 132)" : "rgb(53, 162, 235)" })));
    }
  }, [data, chart]);

  return (
    <div>
      <div className="flex justify-center mt-8">
        <div className="flex items-center mr-8">
          <label className="mr-4 text-[14px]">Year: </label>
          <Select
            indicator={<KeyboardArrowDown />}
            size="sm"
            value={year}
            onChange={(e, newValue) => {
              if (typeof newValue !== "number") {
                return;
              }
              setYear(newValue);
            }}
            sx={{
              width: "250px",
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
          >
            {yearOptions.map((item, index) => (
              <Option value={item} key={index}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
        <div className="flex items-center ms-8">
          <label className="mr-4 text-[14px]">Chart: </label>
          <Select
            indicator={<KeyboardArrowDown />}
            size="sm"
            value={chart}
            onChange={(e, newValue) => {
              if (newValue === "bar" || newValue === "line" || newValue === "pie") setChart(newValue);
            }}
            sx={{
              width: "250px",
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
          >
            <Option value="bar">Bar Chart</Option>
            <Option value="line">Line Chart</Option>
            <Option value="pie">Pie Chart</Option>
          </Select>
        </div>
      </div>
      {chart === "bar" && <BarChart className="mt-2 mb-4" chartTitle="Monthly Revenue" labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]} datasets={barChartData} onClick={(x, y, label) => generateTable(x, label, year)} />}
      {chart === "line" && <LineChart className="mt-2 mb-4" chartTitle="Monthly Revenue" labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]} datasets={lineChartData} onClick={(x, y, label) => generateTable(x, label, year)} />}
      {chart === "pie" && <PieChart chartTitle="Monthly Revenue" labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]} datasets={pieChartData} onClick={(value) => alert(value)} className="mb-4" />}
      {tableData && tableData.length > 0 && <CustomTable rowsPerPage={tableDataCount} rows={tableData} columns={columns1} totalCount={tableDataCount} />}
      <div className="mt-8"></div>
      {tableData2 && tableData.length > 0 && <CustomTable rowsPerPage={tableDataCount2} rows={tableData2} columns={columns2} totalCount={tableDataCount2} />}
    </div>
  );
}
