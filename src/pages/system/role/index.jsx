import React, { useState, useMemo, useEffect } from "react";
import HomeBredCurbs from "@/components/partials/widget/HomeBredCurbs";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/components/partials/widget/GlobalFilter";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllRoles } from '@/utils/getAllRoles';
import DeleteBtn from "../shared/DeleteBtn";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Switch from "@/components/ui/Switch";
import axios from "axios";
import {API_HOST} from "@/utils"
import { useCookies } from "react-cookie";

const COLUMNS = [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => {
      return <span>{parseInt(row?.cell?.row.id) + 1}</span>;
    },
  },
  {
    Header: "Role",
    accessor: "rolename",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "User",
    accessor: "user",
    Cell: (row) => {
      return (
        <Switch
          label="User"
          activeClass="bg-danger-500"
          disabled={true}
          value={row?.cell?.value}
        />
      );
    },
  },
  {
    Header: "Info",
    accessor: "info",
    Cell: (row) => {
      return (
        <Switch
          label="Info"
          activeClass="bg-danger-500"
          disabled={true}
          value={row?.cell?.value}
        />
      );
    },
  },
  {
    Header: "Services",
    accessor: "service",
    Cell: (row) => {
      return (
        <Switch
          label="Service"
          activeClass="bg-danger-500"
          disabled={true}
          value={row?.cell?.value}
        />
      );
    },
  },
  {
    Header: "Blog",
    accessor: "blog",
    Cell: (row) => {
      return (
        <Switch
          label="Blog"
          activeClass="bg-danger-500"
          disabled={true}
          value={row?.cell?.value}
        />
      );
    },
  },
  {
    Header: "action",
    accessor: "action",
    Cell: (row) => {
      const roleId = row?.cell?.row?.original?._id
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
            <button className="action-btn" type="button">
              <Link to={`/role-management/edit/${roleId}`}>
                <Icon icon="heroicons:pencil-square" />
              </Link>
            </button>
          </Tooltip>
          <DeleteBtn row={row}/>
          
        </div>
      );
    },
  },
];


const UserManager = () => {

// User Data Fatching
const dispatch = useDispatch();
const data = useSelector((state) => state.roles);
const updateInfo = useSelector((state) => state.update);

// Cookies
const [cookie, removeCookie] = useCookies()
const headers = {
  'Authorization': `Bearer ${cookie._token}`
}
useEffect(() => {
  if (updateInfo.roleUpdate === "" || updateInfo.roleUpdate === "not-updated") {
    getAllRoles(dispatch, cookie, removeCookie);
  }
}, [dispatch, data, updateInfo]);


// Needed UseState
const [showAddModal, setShowAddModal] = useState(false)

const [roleName, setRoleName] = useState("")
const [userCheck, SetUserCheck] = useState(false)
const [infoCheck, SetInfoCheck] = useState(false)
const [serviceCheck, SetServiceCheck] = useState(false)
const [blogCheck, SetBlogCheck] = useState(false)

  const columns = useMemo(() => COLUMNS, []);
  const title = "Roles"
  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        ...columns,
      ]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;


  const { globalFilter, pageIndex, pageSize } = state;


  // Added Role
  const addedRoleHandler = () => {
    const permissionData = {
      rolename: roleName,
      user: userCheck,
      info: infoCheck,
      service: serviceCheck,
      blog: blogCheck,
    }
    axios
    .post(`${API_HOST}role/add`, permissionData, {
      headers: headers
    })
    .then((res) => {
      setShowAddModal(false)
    })
    .catch((err) => {
      if(err.response.data.error === "Authentication error!"){
        removeCookie("_token")
      }
      console.log(err);
    });
  }
  
  return (
    <div>
      <HomeBredCurbs title="User" />
      <div className="lg:flex flex-wrap blog-posts lg:space-x-5 space-y-5 lg:space-y-0 rtl:space-x-reverse">
        <div className="flex-1">
        <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <div className="mb-3 text-end">
            <Button text="Add Role" className="btn-warning py-2" onClick={() => {
              setShowAddModal(true)
            }}  />
            <Modal
            title="Login Form Modal"
            label="Login Form"
            labelClass="btn-outline-dark"
            activeModal={showAddModal}
            onClose={() => {
              setShowAddModal(false)
            }}
            footerContent={
              <Button
                text="Accept"
                className="btn-dark "
                onClick={() => {
                  addedRoleHandler()
                }}
              />
            }
          >
            <div className="text-base text-slate-600 dark:text-slate-300">
              <Textinput
                label="Role Name"
                type="text"
                placeholder="Type new role"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
              <div className="mt-4 w-2/4 mx-auto">
                <div className="flex justify-between py-3">
                  <Switch
                    label="User"
                    activeClass="bg-danger-500"
                    value={userCheck}
                    onChange={() => SetUserCheck(!userCheck)}
                  />
                  <Switch
                    label="Info"
                    activeClass="bg-danger-500"
                    value={infoCheck}
                    onChange={() => SetInfoCheck(!infoCheck)}
                  />
                </div>
                <div className="flex justify-between py-3">
                  <Switch
                    label="Service"
                    activeClass="bg-danger-500"
                    value={serviceCheck}
                    onChange={() => SetServiceCheck(!serviceCheck)}
                  />
                  <Switch
                    label="Blog"
                    activeClass="bg-danger-500"
                    value={blogCheck}
                    onChange={() => SetBlogCheck(!blogCheck)}
                  />
                </div>
              </div>
            </div>
          </Modal>
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                {/* table head */}
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                {/* table data */}
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Pagination */}
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control py-2 w-max"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Prev
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${
                    pageIdx === pageIndex
                      ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
        {/*end*/}
      </Card>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
