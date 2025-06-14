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
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {getAllUser} from "@/utils/getAllUser"
import DeleteBtn from "@/pages/shared/DeleteBtn";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import axios from "axios";
import {API_HOST} from "@/utils"
import { useCookies } from "react-cookie";
import { getAllUserRoles } from "../../../utils/getAllUserRole";
import { addInfo, removeUser } from "../../../store/layout";

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
              row?.cell?.value 
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              !row?.cell?.value
                ? "text-warning-500 bg-warning-500"
                : ""
            }
             `}
          >
            {row?.cell?.value ? "Active" : "Inactive"}
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
              <Link to={`/user-management/edit/${username}`}>
                <Icon icon="heroicons:pencil-square" />
              </Link>
            </button>
          </Tooltip>
          <DeleteBtn row={row} which={"user"}/>
          
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

  const navigate = useNavigate()
// User Data Fatching
const dispatch = useDispatch();
const userData = useSelector((state) => state.users);
const userRoleData = useSelector((state) => state.userRoles);
const updateInfo = useSelector((state) => state.update);
const [cookie, removeCookie] = useCookies()
const headers = {
  'Authorization': `Bearer ${cookie._token}`
}
const [data, setData] = useState([])

useEffect(() => {
  if (updateInfo.userUpdate === "" || updateInfo.userUpdate === "not-updated") {
    getAllUser(dispatch, cookie, removeCookie);
  }
  if (updateInfo.userRoleUpdate === "" || updateInfo.userRoleUpdate === "not-updated") {
    getAllUserRoles(dispatch, cookie, removeCookie);
  }
}, [dispatch, data, updateInfo, userData]);


useEffect(() => {
  if (userData.length > 0 && userData.length !== data.length && userRoleData.length > 0) {
    const fetchRoleData = async () => {
      const uniqueUserIds = Array.from(new Set(userData.map((user) => user._id)));
      const newUserData = [];

      let dummyIndex = 0

      for (const userId of uniqueUserIds) {
        const user = userData.find((u) => u._id === userId);
        dummyIndex = dummyIndex + 1
        if (user && user.permission && user.permission[0]) {
          try {
            if(user.permission[0] === userRoleData[dummyIndex-1]?._id){
              const res = await axios.get(`${API_HOST}role/${userRoleData[dummyIndex-1]?.role}`, {
                headers: headers,
              });
              const newUser = { ...user, role: res.data[0]?.rolename };
  
              // Check if the user with the same ID already exists in newUserData
              const existingUserIndex = newUserData.findIndex((u) => u._id === newUser._id);
  
              if (existingUserIndex === -1) {
                newUserData.push(newUser);
              } else {
                // If the user exists, replace the old data with the new one
                newUserData[existingUserIndex] = newUser;
              }
            }

          } catch (err) {
            if (err.response && err.response.data.error === "Authentication error!") {
              removeCookie("_token");
            }
            console.log(err);
          }
        }
      }
      setData(newUserData);
    };

    fetchRoleData();
  }
}, [userData, userRoleData, updateInfo]);


// Selected User
const [selectedUser, setSelectedUser] = useState([])
const handleSelect = (user) => {
  const id = user.original._id;

  setSelectedUser((prevSelectedUser) => {
    const isUserInArray = prevSelectedUser.includes(id);
    if (isUserInArray) {
      return prevSelectedUser.filter((item) => item !== id);
    } else {
      return [...prevSelectedUser, id];
    }
  });
};

// Delete User 
const deleteUser = () => {
  selectedUser.map(id => {
    dispatch(addInfo({ field: 'userUpdate', value: 'not-updated' }));
    dispatch(addInfo({ field: 'userRoleUpdate', value: 'not-updated' }));
    dispatch(removeUser(id))
  })
}

// Selected All User
const [showAllDeleteModal, setShowAllDeleteModal] = useState(false)
const [whichDelete, setWhichDelete] = useState("")
const handleAllSelect = () => {
  if(selectedUser.length > 0){
    setShowAllDeleteModal(true)
  }
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

  useEffect(() => {
  }, [globalFilter, setGlobalFilter])
  
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
          <div className="flex items-center justify-between">
          <Button text="Delete Selected" className="btn-warning py-2" onClick={() => {handleAllSelect(); setWhichDelete("selected")}} />

          <Button text="Add User" className="btn-success py-2" onClick={() => navigate("/add-user")} />

          </div>
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
                      .delete(`${API_HOST}user/delete`, { data: { userList: selectedUser }, headers: headers })
                      .then((res) => {
                        setShowAllDeleteModal(false)
                        deleteUser()
                      })
                      .catch((err) => {
                        console.log(err);
                        if(err.response.data.error === "Authentication error!"){
                          removeCookie("_token")
                        }
                        
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
