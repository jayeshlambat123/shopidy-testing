import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Button,
  Form,
  FormLayout,
  Page,
  Select,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
const DiscountPage = () => {
  const app = useAppBridge();
  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log("selectedProducts: ", selectedProducts);

  const [discountType, setDiscountType] = useState("code");
  const [discountValue, setDiscountValue] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [title, setTitle] = useState("");
  const options = [
    { label: "Automatic Discount", value: "automatic" },
    { label: "Code Discount", value: "code" },
  ];
  const handleSelectChange = (value) => setDiscountType(value);

  const openResourcePicker = async () => {
    const products = await app.resourcePicker({
      type: "product",
      multiple: true,
    });
    setSelectedProducts(products);
  };
  const submit = async (type) => {
    console.log("submitted");
    try {
      if (type === "automatic") {
        const res = await fetch("/api/setDiscount", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            products: selectedProducts.map((p) => p.id),
            title,
            discountValue,
          }),
        });
        const resJson = await res.json();
        if (!res.ok) {
          shopify.toast.show(
            "failed to create discount for ids",
            resJson.data.map((p) => p.id),
          );
        }
        const ids = resJson?.data?.map((p) => p);
        console.log("ids: ", ids);
        shopify.toast.show(` ${ids}`);
        console.log("resJsonn: ", resJson);
      } else {
        const res = await fetch("/api/setDiscountWithCode", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            products: selectedProducts.map((p) => p.id),
            title,
            discountValue,
            discountCode,
          }),
        });
        const resJson = await res.json();
        if (!res.ok) {
          shopify.toast.show(
            "failed to create discount for ids",
            resJson.data.map((p) => p.id),
          );
        }
        const ids = resJson?.data?.map((p) => p);
        console.log("ids: ", ids);
        shopify.toast.show(` ${ids}`);
        console.log("resJsonn: ", resJson);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <Page title="Create Discount">
      <>
        <Form >
          <h1>Apply Discounts</h1>

          <FormLayout>
            <Select
              label="Select Discount Type"
              options={options}
              onChange={handleSelectChange}
              value={discountType}
            />
            {discountType === "code" && (
              <TextField
                label="Discount Code"
                type="text"
                name="discountCode"
                value={discountCode}
                onChange={setDiscountCode}
                autoComplete="off"
              />
            )}
            <TextField
              label="Discount Value"
              type="number"
              name="discountValue"
              value={discountValue}
              onChange={setDiscountValue}
              autoComplete="off"
            />

            <TextField
              label="Discount title"
              name="title"
              value={title}
              onChange={setTitle}
            />

            <Button onClick={openResourcePicker}>Select Products</Button>

            {selectedProducts && selectedProducts.length > 0 && (
              <p>Selected Products: {selectedProducts.length}</p>
            )}

            <Button onClick={() => submit(discountType)} primary>
              Create Discount
            </Button>
          </FormLayout>
        </Form>
      </>
    </Page>
  );
};
export default DiscountPage;
