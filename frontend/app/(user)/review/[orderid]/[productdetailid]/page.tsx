"use client";

export default function ReviewForm({ params }: { params: { orderid: number; productdetailid: number } }) {
  const { orderid, productdetailid } = params;

  console.log(orderid);
  console.log(productdetailid);

  return <div>This is review form page!</div>;
}
