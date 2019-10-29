import _omit from "lodash/omit";

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Toast from "grommet/components/Toast";

import { fetchAndAssignSchema } from "../../actions/common";

import JSONSchemaPreviewer from "./form/JSONSchemaPreviewer";
import Sidebar from "./components/DepositSidebar";

const transformSchema = schema => {
  const schemaFieldsToRemove = [
    "_access",
    "_deposit",
    "_cap_status",
    "_buckets",
    "_files",
    "$ana_type",
    "$schema",
    "general_title",
    "_experiment",
    "control_number"
  ];

  schema.properties = _omit(schema.properties, schemaFieldsToRemove);
  schema = {
    type: schema.type,
    properties: schema.properties,
    dependencies: schema.dependencies
  };
  return schema;
};

class DraftPreview extends React.Component {
  componentDidMount() {
    // Check if schemaId exist on state and fetch schema if needed
    if (this.props.schemaId) {
      // If form schemas are empty, then fetch
      if (this.props.schemas == null) {
        this.props.fetchAndAssignSchema(this.props.schemaId);
      }
      // If form schemas aren't empty and schemaId different than the one needed
      // fetch and assign the correct schema
      else if (this.props.schemaId != this.props.schemas.schemaId) {
        this.props.fetchAndAssignSchema(this.props.schemaId);
      }
    }
  }

  componentDidUpdate() {
    if (this.props.schemaId) {
      if (!this.props.schemasLoading) {
        if (
          this.props.schemas == null ||
          this.props.schemaId != this.props.schemas.schemaId
        ) {
          this.props.fetchAndAssignSchema(this.props.schemaId);
        }
      }
    }
  }

  render() {
    let _schema =
      this.props.schemas && this.props.schemas.schema
        ? transformSchema(this.props.schemas.schema)
        : null;

    return (
      <Box id="deposit-page" flex={true}>
        {this.props.error ? (
          <Toast status="critical">{this.props.error.message}</Toast>
        ) : null}

        <Box direction="row" flex={true} wrap={false}>
          {this.props.schemas && this.props.schemas.schema ? (
            <Box flex={true}>
              <Box flex={true}>
                <Box flex={false} pad="medium">
                  <JSONSchemaPreviewer
                    formData={this.props.formData} // TOFIX: change to get from metadata
                    schema={_schema}
                    uiSchema={this.props.schemas.uiSchema || {}}
                    onChange={() => {}}
                  >
                    <span />
                  </JSONSchemaPreviewer>
                </Box>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  }
}

DraftPreview.propTypes = {
  match: PropTypes.object,
  draft_id: PropTypes.string,
  schemas: PropTypes.object,
  schemaId: PropTypes.string,
  formData: PropTypes.object,
  schemasLoading: PropTypes.bool,
  fetchAndAssignSchema: PropTypes.func,
  error: PropTypes.object
};

function mapStateToProps(state) {
  return {
    schemaId: state.draftItem.get("schema"),
    schemas: state.draftItem.get("schemas"),
    // schemasLoading: state.draftItem.get("schemasLoading"),

    draft_id: state.draftItem.get("id"),
    formData: state.draftItem.get("formData") // TOFIX: remove to get from metadata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAndAssignSchema: (schemaURL, schemaID, schemaVersion) =>
      dispatch(fetchAndAssignSchema(schemaURL, schemaID, schemaVersion))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftPreview);
