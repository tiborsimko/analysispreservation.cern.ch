import React from "react";

import Box from "grommet/components/Box";

import Button from "../../../partials/Button";

import Form from "../../../drafts/form/GrommetForm";
import PropTypes from "prop-types";

const createContentTypeSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Name",
      description: "Provide a name for your type"
    },
    description: {
      type: "string",
      title: "Description",
      description: "Give a small description of the content type"
    }
  }
};

const createContentTypeUISchema = {
  description: { "ui:widget": "textarea" }
};

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  render() {
    return (
      <Box pad="medium">
        <Form
          schema={createContentTypeSchema}
          uiSchema={createContentTypeUISchema}
          onSubmit={this.props.onSubmit}
          formRef={f => (this.formRef = f)}
        >
          <Box
            pad="small"
            justify="center"
            align="center"
            direction="row"
            margin={{ top: "small" }}
            wrap={false}
          >
            <Button
              text="Create"
              primary
              onClick={() => this.formRef.submit()}
            />
          </Box>
        </Form>
      </Box>
    );
  }
}

Create.propTypes = {
  cancel: PropTypes.func,
  onSubmit: PropTypes.func
};

export default Create;
