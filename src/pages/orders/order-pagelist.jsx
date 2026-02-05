import React, { useEffect, useState } from "react";
import { allOrderList } from "../../services/order/order";

export default function OrderPageList() {
  const [orderList, setOrderList] = useState([]);
  useEffect(() => {
    const fetchOrderList = async () => {
      const res = await allOrderList();
      if (res) {
        setOrderList(res?.data);
      }
    };
    fetchOrderList();
  }, []);

   console.log(orderList,"orderList")
  return <div>OrderPageList</div>;
}
