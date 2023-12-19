import { MonthValue, OrderStatusValue } from "../_enums/order-enums";

/**
 *
 * This will map input value to MonthValue enum
 * @param value (string)
 * @returns MonthValue (enum)
 */
export function mapStringToMonthValue(value: string): MonthValue {
  switch (value) {
    case "0":
      return MonthValue.All;
    case "1":
      return MonthValue.Jan;
    case "2":
      return MonthValue.Feb;
    case "3":
      return MonthValue.Mar;
    case "4":
      return MonthValue.Apr;
    case "5":
      return MonthValue.May;
    case "6":
      return MonthValue.Jun;
    case "7":
      return MonthValue.Jul;
    case "8":
      return MonthValue.Aug;
    case "9":
      return MonthValue.Sep;
    case "10":
      return MonthValue.Oct;
    case "11":
      return MonthValue.Nov;
    case "12":
      return MonthValue.Dec;
    default:
      return MonthValue.All;
  }
}

/**
 *
 * This will map the input value to OrderStatusValue enum
 * @param value (string)
 * @returns OrderStatusValue (enum)
 */
export function mapStringToOrderStatusValue(value: string): OrderStatusValue {
  switch (value) {
    case "all":
      return OrderStatusValue.All;
    case "in progress":
      return OrderStatusValue.InProgress;
    case "confirmed":
      return OrderStatusValue.Confirmed;
    case "delivered":
      return OrderStatusValue.Delivered;
    case "received":
      return OrderStatusValue.Received;
    case "cancelled":
      return OrderStatusValue.Cancelled;
    default:
      return OrderStatusValue.All;
  }
}
