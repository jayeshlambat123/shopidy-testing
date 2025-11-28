import { authenticate } from "../shopify.server";
import { discountCodeMutation } from "../queries/discoutQueries";
export const action = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    console.log("admin: ", admin);
    console.log("shop: ", session.shop);
    const data = await request.json();
    console.log("data", data);
    console.log("request.body: ", request.body);
    const productdIds = data.products.map((p) => p);
    console.log("productdIds: ", productdIds);
    const title = data.title;
    const percentage = Number(data.discountValue) / 100;
    console.log("percentage 13: ", percentage);
    const discountCode = data.discountCode;
    console.log("discountCode: ", discountCode);
    console.log("title: ", title);
    console.log("action");

    const variables = {
      basicCodeDiscount: {
        title,
        code: discountCode,
        context: {
          all: "ALL",
        },
        customerGets: {
          value: {
            percentage: percentage,
          },
          items: {
            products: {
              productsToAdd: productdIds,
            },
          },
        },
        startsAt: new Date().toISOString(),
      },
    };

    const res = await admin.graphql(discountCodeMutation, { variables });
    const resJson = await res.json();
    console.log("resJson: ", resJson);
    const DiscountNode = resJson.data.discountCodeBasicCreate;
    console.log("DiscountNode: ", DiscountNode);
    const error = resJson.data.discountCodeBasicCreate.userErrors;
    console.log("error: ", error);
    return { data: data.products, message: "Discount created succesfully" };
  } catch (error) {
    console.log("error: ", error);
    return { error, message: "Failed to create discount" };
  }
};
export const loader = () => {
  console.log("loader");
  return {};
};
