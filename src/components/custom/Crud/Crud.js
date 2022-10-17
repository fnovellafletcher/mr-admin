import React, { useState, useEffect, useCallback } from "react";
import { Table, Modal, Card, Button, Row, Col, message, Space } from "antd";
import CrudForm from "./CrudForm";
import { useIntl } from "util/IntlMessages";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UpOutlined,
} from "@ant-design/icons";

const Crud = (props) => {
  // props:
  // columns, formFieldsFilter, formFieldsCrud, find, findOne, update, insert, delete, tableColumns, textKeys, idName

  const { createRecordTextKey, updateRecordTextKey } = props.textKeys;
  const showTable = props.showTable != undefined ? props.showTable : true;
  const intl = useIntl();

  const [mode, setMode] = useState("view");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [formDataCrud, setFormDataCrud] = useState({});
  const [formDataFilter, setFormDataFilter] = useState({});
  const [pagination, setPagination] = useState({});
  const [sorter, setSorter] = useState({}); // field, order

  const idName = props.idName || "id";
  const filtersEnabled =
    props.formFieldsFilter && props.formFieldsFilter.length;

  const handleCustomUpdate = (onClick) => async () => {
    await onClick();
    await getRows(pagination, null, sorter);
  };

  const actionColumn = {
    title: intl.formatMessage({
      id: "crud.table.action.column.label",
      defaultMessage: "Actions",
    }),
    dataIndex: "",
    key: "action",
    width: 120,
    render: (text, record) => {
      return (
        <>
          {props.updateRedirect ? (
            <Button
              icon={<EditOutlined />}
              onClick={(e) => props.updateRedirect(record[idName])}
            ></Button>
          ) : (
            ""
          )}
          {props.update ? (
            <Button
              icon={<EditOutlined />}
              onClick={(e) => openEditForm(record[idName])}
            ></Button>
          ) : (
            ""
          )}
          {props.customUpdate ? (
            <Button
              icon={props.customUpdate(record).icon}
              onClick={handleCustomUpdate(props.customUpdate(record).onClick)}
            ></Button>
          ) : (
            ""
          )}
          {props.remove ? (
            <Button
              icon={<DeleteOutlined />}
              onClick={(e) => deleteRecord(record[idName])}
            ></Button>
          ) : (
            ""
          )}
        </>
      );
    },
  };

  const columns = [...props.tableColumns].map((x) => ({
    ...x,
    title: intl.formatMessage({
      id: x.title,
      defaultMessage: x.title,
    }),
  }));

  if (props.update || props.remove) columns.push(actionColumn);

  if (filtersEnabled) {
    for (let item of props.formFieldsFilter) {
      formDataFilter[item.name] = item.value;
    }
  }

  const getRows = useCallback(
    async (_pagination, _filters, _sorter) => {
      // loading state on
      // console.log('formDataFilter', formDataFilter)
      // console.log("sorter", _sorter);
      // console.log('pagination', pagination)
      // if (!_pagination) _pagination = { ...pagination }
      try {
        const page = _pagination.current;
        // const offset = (page -1 ) * _pagination.pageSize
        setTableLoading(true);
        const { data } = await props.find(
          { page, limit: _pagination.pageSize },
          formDataFilter,
          _sorter
        );
        setTableLoading(false);

        if (data.results) {
          setTableData(data.results);
          setPagination({
            ..._pagination,
            total: data.total,
            showTotal: () => `Total: ${data.total}`,
          });
        } else if (Array.isArray(data)) {
          setTableData(data);
          setPagination({
            ..._pagination,
            total: data.length,
            showTotal: () => `Total: ${data.length}`,
          });
        } else {
          setTableData([]);
          setPagination({
            ..._pagination,
            total: 0,
            showTotal: () => `Total: ${0}`,
          });
        }
        setSorter({ ..._sorter });
      } catch (e) {
        console.log(e);
      }
      // loading state off
    },
    [formDataFilter, props]
  );

  useEffect(() => {
    const doFetch = async () => {
      // console.log('useEffect')
      // console.log('ccc', pagination.current, pagination.pageSize, pagination.total)
      await getRows(
        {
          current: 1,
          pageSize: props.pageSize || 8,
          total: 0,
          position: props.position || "top",
        },
        null,
        {}
      ); // instead of await getRows(pagination)
    };
    doFetch();
    // return
  }, [getRows, props.pageSize, props.position]); // only on mount, getRows will causes problems

  const getRow = async (id) => {
    if (loading) return;
    setLoading(true);
    let result;
    if (id) {
      // edit
      const { data } = await props.findOne({ id });
      result = data;
    }
    setFormDataCrud(result);
    setLoading(false);
  };

  const openAddForm = async () => {
    await getRow();
    setMode("add");
  };

  const openEditForm = async (id) => {
    await getRow(id);
    setMode("edit");
  };

  useEffect(() => {
    if (props.setParentMode) {
      props.setParentMode(mode);
    }
  }, [mode]);

  const deleteRecord = async (id) => {
    console.log(id);
    Modal.confirm({
      title: intl.formatMessage({
        id: "crud.action.delete.modal.title",
        defaultMessage: "Confirmation",
      }),
      content: intl.formatMessage({
        id: "crud.action.delete.modal.content",
        defaultMessage: "Proceed To Delete?",
      }),
      okText: intl.formatMessage({
        id: "crud.action.delete.modal.confirm.button.text",
        defaultMessage: "Confirm",
      }),
      cancelText: intl.formatMessage({
        id: "crud.action.delete.modal.cancel.button.text",
        defaultMessage: "Cancel",
      }),
      onCancel: () => console.log("cancel"),
      onOk: async () => {
        // e.stopPropagation()
        if (loading) return;
        setLoading(true);
        await props.remove({ id });
        if (tableData.length === 1 && pagination.current > 1) {
          pagination.current = pagination.current - 1;
        }
        getRows(pagination, null, sorter);
        setLoading(false);
      },
      okButtonProps: {
        type: "danger",
      },
      // cancelButtonProps
    });
  };

  const updateFieldValueCrud = (name, value) => {
    // console.log(name, value);
    // setFormDataFilter({...formDataCrud, [name]: value })
  };

  const updateFieldValueFilter = (name, value) => {
    setFormDataFilter({ ...formDataFilter, [name]: value });
  };

  const handleFormSubmit = async ({ id, data }) => {
    if (loading) return;
    setLoading(true);
    try {
      if (mode === "add") {
        await props.insert({ _data: data });
      } else if (mode === "edit") {
        await props.update({ id, _data: data });
      }
      await getRows(pagination, null, sorter);
      setMode("view");
    } catch (e) {
      const errorMessage = e.message || e.error;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // use display none instead of ? to show / hide components... cause problems in the case of Table sorter
  return (
    <React.Fragment>
      <div style={{ display: mode === "view" ? "block" : "none" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={6}>
            {props.insert && (
              <Col>
                <Button
                  icon={<PlusOutlined shape="circle" twoToneColor="#eb2f96" />}
                  onClick={openAddForm}
                  type="primary"
                >
                  {intl.formatMessage({
                    id: createRecordTextKey,
                    defaultMessage: "Add new entry",
                  })}
                </Button>
              </Col>
            )}
            {showTable && (
              <>
                {filtersEnabled && (
                  <Col>
                    <Button
                      icon={showFilter ? <UpOutlined /> : <SearchOutlined />}
                      onClick={() => setShowFilter(!showFilter)}
                    />
                  </Col>
                )}
                <Col>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={async () => {
                      pagination.current = 1;
                      if (loading) return;
                      setLoading(true);
                      await getRows(pagination, null, sorter);
                      setLoading(false);
                    }}
                  />
                </Col>
              </>
            )}
          </Row>
          {showTable && (
            <>
              <Row gutter={6}>
                {showFilter && (
                  <CrudForm
                    idName={idName}
                    formType={"filter"}
                    mode={mode}
                    setMode={setMode}
                    formFields={props.formFieldsFilter}
                    formData={formDataFilter}
                    loading={loading}
                    handleFormSubmit={handleFormSubmit}
                    updateFieldValue={updateFieldValueFilter}
                  />
                )}
              </Row>
              <Table
                rowKey={idName}
                size="small"
                bordered
                loading={tableLoading}
                dataSource={tableData}
                columns={columns}
                pagination={pagination}
                onChange={(pagination, filters, sorter) => {
                  console.log("change table", sorter);
                  // if (loading) return
                  setLoading(true);
                  getRows(pagination, filters, sorter);
                  setLoading(false);
                }}
              />
            </>
          )}
        </Space>
      </div>
      <div style={{ display: mode !== "view" ? "block" : "none" }}>
        {mode === "add" && (
          <Row>
            <Col span={12}>
              <Card title={intl.formatMessage({ id: createRecordTextKey })}>
                <CrudForm
                  idName={idName}
                  formType={"crud"}
                  mode={mode}
                  setMode={setMode}
                  formFields={props.formFieldsCrud}
                  formData={formDataCrud}
                  loading={loading}
                  handleFormSubmit={handleFormSubmit}
                  updateFieldValue={updateFieldValueCrud}
                  showIdOnUpdate={props.showIdOnUpdate}
                />
              </Card>
            </Col>
          </Row>
        )}

        {mode === "edit" && formDataCrud !== {} && !loading && (
          <Row>
            <Col span={12}>
              <Card title={intl.formatMessage({ id: updateRecordTextKey })}>
                <CrudForm
                  idName={idName}
                  formType={"crud"}
                  mode={mode}
                  setMode={setMode}
                  formFields={props.formFieldsCrud}
                  formData={formDataCrud}
                  loading={loading}
                  handleFormSubmit={handleFormSubmit}
                  updateFieldValue={updateFieldValueCrud}
                  showIdOnUpdate={props.showIdOnUpdate}
                />
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </React.Fragment>
  );
};

export default Crud;
