let data = [
    {
      id: '0001',
      title: "to do task 1 ",
      percentage: 0,
      field: "todo"
    },
    {
      id: '0002',
      title: "urgent task 1",
      percentage: 25,
      field: "urgent"
    },
    {
      id: '0003',
      title: "in progress task 1",
      percentage: 63,
      field: "inprogress"
    },
    {
      id: '0004',
      title: "in progress task 2",
      percentage: 63,
      field: "inprogress"
    }
];
/************ add data ***********/
let dataFunc = (task) => {
    return data.push(task);
};
export default data;
export { dataFunc};
