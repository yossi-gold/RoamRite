import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";


// 📅 Calendar Component
const Calendar = ({
  initialRangeValuesProps,
  onRangeChange,
  setOnRangeDateInScreen
}) => {
  const [rangeValues, setRangeValues] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  ]);

  useEffect(() => {
    if (initialRangeValuesProps) {
      setRangeValues([initialRangeValuesProps]);
    }
  }, [initialRangeValuesProps]);

  return (
    <DateRange
      ranges={rangeValues}
      onChange={(item) => {
        setRangeValues([item.selection]);
        onRangeChange(item.selection);
        setOnRangeDateInScreen?.(item.selection);
      }}
      // Uncomment below to restrict to future dates only
      // minDate={dayjs().add(1, "day").toDate()}
      months={2}
      direction="horizontal"
      showDateDisplay={false}
    />
  );
};

// 🚀 Main App Component
export function TheApp() {
  const [selectedRange, setSelectedRange] = useState(null);


  return (
    <div className="App">
      <Calendar
        initialRangeValuesProps={selectedRange}
        onRangeChange={(e) => setSelectedRange(e)}
       
      />
      {console.log("Selected range:", selectedRange)}
      <button onClick={() => setSelectedRange(null)}>Reset</button>
      <button onClick={() => {
  const today = new Date();
  setSelectedRange({
    startDate: today,
    endDate: today,
    key: "selection"
  });
 
}}>
  Today
</button>
    </div>
  );
}