import React, { useState } from "react";
import TextEditor from "../../components/joditEditor/JoditEditor";
import { Row, Col } from "react-bootstrap";
const config = {
  buttons: ["bold", "italic", "underline", "link", "link", "source"],
};
export const Policy = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <Row>
        <Col md={2} className="left-pan"></Col>
        <Col md={8} >
          <TextEditor setValue={setValue} config={config} />
          <br />
          <div>{value}</div>
        </Col>
      </Row>
    </>
  );
};