import { authenticate } from "../shopify.server";
import { automaticDiscountCreate } from "../queries/discoutQueries";
export const action = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    console.log("admin: ", admin);
    console.log("shop: ", session.shop);
    const data = await request.json();
    console.log("request.body: ", request.body);
    const productdIds = data.products.map((p) => p);
    const percentage = Number(data.discountValue) / 100;
    console.log("percentage : ", percentage);
    const title = data.title;
    console.log("title: ", title);
    console.log("data", data);
    console.log("action");

    const variables = {
      input: {
        title,
        startsAt: new Date().toISOString(),
        customerGets: {
          value: { percentage },
          items: {
            products: {
              productsToAdd: productdIds,
            },
          },
        },
      },
    };
    const res = await admin.graphql(automaticDiscountCreate, { variables });
    const resJson = await res.json();
    const automaticDiscountNode =
      resJson.data.discountAutomaticBasicCreate.automaticDiscountNode;
    console.log("automaticDiscountNode: ", automaticDiscountNode);
    const error = resJson.data.discountAutomaticBasicCreate.userErrors;
    console.log("error: ", error);
    return { data: data.products, message: "discount created succesfully" };
  } catch (error) {
    console.log("error: ", error);
    return { error, message: "Failed to create discount" };
  }
};
export const loader = () => {
  console.log("loader");
  return {};

};