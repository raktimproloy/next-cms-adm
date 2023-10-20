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
import {getUser} from "@/utils/getAllUser"
import DeleteBtn from "./DeleteBtn";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import axios from "axios";

const COLUMNS = [
  {
    Header: "Id",
    accessor: "id",
    Cell: (row) => {
      return <span>{parseInt(row?.cell?.row.id) + 1}</span>;
    },
  },
  {
    Header: "Username",
    accessor: "username",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Email",
    accessor: "email",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Role",
    accessor: "role",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "status",
    accessor: "status",
    Cell: (row) => {
      return (
        <span className="block w-full">
          <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value == "1"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              row?.cell?.value == "0"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
             `}
          >
            {row?.cell?.value === "1" ? "Active" : "Inactive"}
          </span>
        </span>
      );
    },
  },
  {
    Header: "Last Login",
    accessor: "last_login",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "action",
    accessor: "action",
    Cell: (row) => {
      const username = row?.cell?.row?.values?.username
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="View" placement="top" arrow animation="shift-away">
            <button className="action-btn" type="button">
              <Link to={`/profile/${username}`}>
                <Icon icon="heroicons:eye" />
              </Link>
            </button>
          </Tooltip>
          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
            <button className="action-btn" type="button">
              <Link to={`/user-manager/edit`}>
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

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);


const UserManager = () => {

// User Data Fatching
const dispatch = useDispatch();
const data = useSelector((state) => state.users);
const updateInfo = useSelector((state) => state.update);
useEffect(() => {
  if (updateInfo.userUpdate === "" || updateInfo.userUpdate === "not-updated") {
      getUser(dispatch, data);
  }
}, [dispatch, data, updateInfo]);


// Selected User
const [selectedUser, setSelectedUser] = useState([])
const handleSelect = (user) => {
  const id = user.original._id;

  setSelectedUser((prevSelectedUser) => {
    const isUserInArray = prevSelectedUser.includes(id);
    console.log(isUserInArray)
    if (isUserInArray) {
      return prevSelectedUser.filter((item) => item !== id);
    } else {
      return [...prevSelectedUser, id];
    }
  });
};

// Delete User 

// Selected All User
const [showAllDeleteModal, setShowAllDeleteModal] = useState(false)
const [whichDelete, setWhichDelete] = useState("")
const handleAllSelect = () => {
  setShowAllDeleteModal(true)
}

  const columns = useMemo(() => COLUMNS, []);
  const title = "Users"
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
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              {/* <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()}
                onClick={() => handleAllSelect()}
              /> */}
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()}
               onClick={(e) => {handleSelect(
                row
               )}} 
              />
            </div>
          ),
        },
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
  
  return (
    <div>
      <HomeBredCurbs title="User" />
      <div className="lg:flex flex-wrap blog-posts lg:space-x-5 space-y-5 lg:space-y-0 rtl:space-x-reverse">
        <div className="flex-1">
        <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="mb-3">
          <Button text="Delete Selected" className="btn-warning py-2" onClick={() => {handleAllSelect(); setWhichDelete("selected")}} />
          <Button text="Delete All" className="btn-warning py-2 ms-4" onClick={() => {handleAllSelect(); setWhichDelete("all")}} />
          <Modal
              title="Warning"
              label=""
              labelClass="btn-outline-warning p-1"
              themeClass="bg-warning-500"
              activeModal={showAllDeleteModal}
              onClose={() => {
                setShowAllDeleteModal(false)
              }}
              footerContent={
                <Button
                  text="Accept"
                  className="btn-warning "
                  onClick={() => 
                    {
                      axios
                      .delete(`http://localhost:3001/user/delete`, { data: { userList: selectedUser } })
                      .then((res) => {
                        setShowAllDeleteModal(false)
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    }
                  }
                />
              }
            >
              <h4 className="font-medium text-lg mb-3 text-slate-900">
                Delete All Users
              </h4>
              <div className="text-base text-slate-600 dark:text-slate-300">
                Do you want to delete all users?
              </div>
          </Modal>
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
