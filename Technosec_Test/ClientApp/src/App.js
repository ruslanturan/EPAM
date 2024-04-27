import './App.css';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import { useEffect, useState, useCallback, useRef } from 'react';
const App = () => {
  const gridRef = useRef()
  const [selectedRow, setSelectedRow] = useState()
  const [rowData, setRowData] = useState()
  const [requestState, setRequestState] = useState({message: "Loading...", showLoading: true})
  const updater = (el) => {
    setRequestState({ message: "Loading...", showLoading: true })
    if(el.id === 0){
      var myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")
      var form = {
        Make: el.make,
        Model: el.model,
        Nov: el.nov,
        Dec: el.dec,
        Jan: el.jan,
        Date: new Date(el.date)
      }
      myHeaders.append("json", JSON.stringify(form))
      var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow'
      }
      
      fetch("/API/Cars/Create", requestOptions)
          .then(response => response.text())
          .then(result => {
              let obj = JSON.parse(result)
              obj = obj.map((el) => {
                el.date = el.date.split("T")[0]
                return el
              })
              setRowData(obj)
              setRequestState({ message: "Loading...", showLoading: false })
          })
          .catch(error => {
            setRequestState({ message: "Error occurred.", showLoading: true })
          })
    }
    else{
      var myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")
      var form = {
        Id: el.id,
        Make: el.make,
        Model: el.model,
        Nov: el.nov,
        Dec: el.dec,
        Jan: el.jan,
        Date: new Date(el.date)
      }
      myHeaders.append("json", JSON.stringify(form))
      var requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          redirect: 'follow'
      }
      
      fetch("/API/Cars/Update", requestOptions)
          .then(response => response.text())
          .then(result => {
              let obj = JSON.parse(result)
              obj = obj.map((el) => {
                el.date = el.date.split("T")[0]
                return el
              })
              setRowData(obj)
              setRequestState({ message: "Loading...", showLoading: false })
          })
          .catch(error => {
            setRequestState({ message: "Error occurred.", showLoading: true })
          })
    }
    setSelectedRow([])
  }
  const getter = (params) => {
    return params.data[params.colDef.field]
  }
  const setter = (params) => {
    if(params.newValue.trim() !== ""){
      params.data[params.colDef.field] = params.newValue
      let newData = rowData.map((el) => {
        if(el[params.colDef.field] === params.data[params.colDef.field]){
          el[params.colDef.field] = params.newValue
          updater(el)
        }
        return el
      })
      setRowData(newData)
      return true
    }
  }
  const numericSetter = (params) => {
    if(!isNaN(params.newValue)){
      params.data[params.colDef.field] = Math.trunc(params.newValue)
      let newData = rowData.map((el) => {
        if(el[params.colDef.field] === params.data[params.colDef.field]){
          el[params.colDef.field] = Math.trunc(params.newValue)
          updater(el)
        }
        return el
      })
      setRowData(newData)
      return true
    }
  }
  const columnDefs = [
    {headerName: "Make", field: "make", editable: true, valueGetter: getter, valueSetter: setter},
    {headerName: "Model", field: "model", editable: true, valueGetter: getter, valueSetter: setter},
    {headerName: "Sold in November", field: "nov", editable: true, valueGetter: getter, valueSetter: numericSetter},
    {headerName: "Sold in December", field: "dec", editable: true, valueGetter: getter, valueSetter: numericSetter},
    {headerName: "Sold in January", field: "jan", editable: true, valueGetter: getter, valueSetter: numericSetter},
    {headerName: "Date of production", field: "date", editable: true, valueGetter: getter, valueSetter: setter, cellEditor: 'agDateStringCellEditor'}
  ]
  useEffect(() => {
    async function fetchData(){
      setRequestState({ message: "Loading...", showLoading: true })
      try {
        const response = await fetch("/API/Cars", {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          },
        })

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`)
        }

        let result = await response.json()
        result = result.map((el) => {
          el.date = el.date.split("T")[0]
          return el
        })
        setRowData(result)
        setSelectedRow([])
        setRequestState({ message: "Loading...", showLoading: false })
      } catch (err) {
        setRequestState({ message: "Error occurred.", showLoading: true })
      } 
    }
    fetchData()
  },[])
  const onCreateClick = () => {
    setSelectedRow([])
    let arr = [...rowData]
    arr.push({id: 0, date:new Date().toISOString().split('T')[0], make:"Enter make", model:"Enter model", nov:0,dec:0,jan:0})
    setRowData(arr)
  }
  const onSelectionChange = useCallback(() => {
    setSelectedRow(gridRef.current.api.getSelectedRows())
  }, [])
  const onDeleteClick = () => {
    if(selectedRow[0].id !== 0){
      setRequestState({ message: "Loading...", showLoading: true })
      var myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")
      var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow'
      }
      fetch("/API/Cars/Delete?id=" + selectedRow[0].id, requestOptions)
        .then(response => response.text())
        .then(result => {
            let obj = JSON.parse(result)
            obj = obj.map((el) => {
              el.date = el.date.split("T")[0]
              return el
            })
            setRowData(obj)
            setRequestState({ message: "Loading...", showLoading: false })
        })
        .catch(error => {
          setRequestState({ message: "Error occurred.", showLoading: true })
        })
    }
    else{
      let newData = rowData.filter((el) => {
        if(el.id !== selectedRow[0].id){
          return el
        }
      })
      setRowData(newData)
    }
  }
  return (
    <div className="App">
      {!requestState.showLoading ?
        <div style={{ margin:"20px" }}>
          <div style={{maxWidth:"600px", margin:"20px"}}>
            <Line
              datasetIdKey='id'
              data={{
                labels: ["November", "December", "January"],
                datasets: rowData.map((el, index) => {
                  return { id:index + 1, label: el.make + ", " + el.model, data: [el.nov, el.dec, el.jan]}
                }),
              }}/>
          </div>
          <div style={{margin:"20px", height:"40px"}}>
            {rowData.filter(e => e.id === 0).length === 0 &&
              <button onClick={onCreateClick} style={{fontSize:"20px"}}>New Record</button>
            }
            {selectedRow !== undefined && selectedRow.length > 0 &&
              <button onClick={onDeleteClick} style={{fontSize:"20px", background:"red",color:"white", marginLeft:"20px"}}>Delete</button>
            }
          </div>
          <div className="ag-theme-alpine" style={{height: 80 + (rowData.length*65) + "px"}}>
            <AgGridReact
              ref={gridRef}
              rowSelection={'single'}
              columnDefs={columnDefs}
              onSelectionChanged={onSelectionChange}
              rowData={rowData}>
            </AgGridReact>
          </div>
        </div> :
        <div className='App-header'>
          <img className='App-logo' src='logo512.png'/>
          <p>Loading...</p>
        </div>
      }
    </div>
  )
}

export default App;
