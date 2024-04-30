import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MainPage from './pages/MainPage'
import jsonData from './assets/testparktyki-cbfe153e13e9.json'
import { readFile, utils } from 'xlsx'
import * as XLSX from "xlsx"

function App() {

  const empty: unknown[] = []

  const [fileJson, setFileJson] = useState(empty);

  const path = "C:/Users/mbork/Documents/codeing/work/JiraToCalc/src/assets/raportFile.xls";

  const handleFile = (file: File): [] => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader()
    const rABS = !!reader.readAsBinaryString
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target?.result
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" })
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      console.log(rABS, wb)
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
      /* Update state */
      // this.setState({ data: data, cols: make_cols(ws["!ref"]) })
      
      data.forEach((row: any)=>{
        if(row.length>33){
          row.splice(33);
        }

        row.forEach((el: any) => {
          // el.replace(',','.');
          try{(el as string).replace(',','.');}catch{}
          // console.log(el);
        });
      })
      
      console.log(data);
      return data;
    }
    if (rABS) reader.readAsBinaryString(file)
    else reader.readAsArrayBuffer(file)

    return [];
  }


      //   try {
      //     const client = new google.auth.JWT(
      //         jsonData.client_email, undefined, jsonData.private_key, ['https://www.googleapis.com/auth/spreadsheets']
      //     );

      //     client.authorize(async function(err, tokens) {
      //         if (err) {
      //           console.log(JSON.stringify({error: true}));
      //         }

      //         const gsapi = google.sheets({version:'v4', auth: client});

      //         //CUSTOMIZATION FROM HERE
      //         const opt = {
      //             spreadsheetId: '1Mcevvg2hBSQBN0TUsFMdKiob2v2UqhGKdTFEoXXYzYs',
      //             range: 'Sheet1!A2:A'
      //         };

      //         let data = await gsapi.spreadsheets.values.get(opt);
      //         console.log(JSON.stringify({error: false, data: data.data.values}));
      //     });
      // } catch (e: any) {
      //   console.log(JSON.stringify({error: true, message: e.message}));
      // }

      useEffect(()=>{
        fetch("https://script.google.com/macros/s/AKfycbz-A1ctagHojWLoLa-ln8vz2vujXcOcoVQBex97IpdIz9m_l34qKNA60ifuu8lvFSPLAw/exec").then(response=>response.json()).then((data: any)=>{
          const tab = data[0].data;
          console.log(tab);
      })

      // const file = readFile(path);

      
      // let data: any = []
      // const sheets = file.SheetNames
      // for (let i = 0; i < sheets.length; i++) {
      //     const temp = utils.sheet_to_json(
      //         file.Sheets[file.SheetNames[i]])
      //     temp.forEach((res) => {
      //         data.push(res)
      //     })
      // }
      // console.log(data);

      

      console.log('FileJson: ',fileJson);

      },[fileJson])

      const refFile = useRef<HTMLInputElement>(null);

      const getFile = () => {
        if(refFile.current){
          if(refFile.current.files){

            const preFile: File = refFile.current.files[0];
            setFileJson(handleFile(preFile));
          }
        }
      }

      const refFormShare = useRef<HTMLFormElement>(null);

  return (
    <>
      <input type="file" ref={refFile} onChange={getFile} name="x" id="x" />
     {/* <MainPage /> */}
     <form action="" ref={refFormShare} name="submit-to-google-sheet" onSubmit={(e)=>{
        e.preventDefault();
        fetch("https://script.google.com/macros/s/AKfycbxgadAliIzDBUpkb64G7rhHXpJtHWicmDRiO9_s44LjUeisbge9GWYnGzFlHFwVFuFA0g/exec", { method: 'POST', body: new FormData(refFormShare.current as HTMLFormElement)})
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message))
  }}>
      <input type="text"   placeholder='Account' name='Account' required />
      <button type="submit">Wyslij</button>
     </form>
    </>
  )
}

export default App
