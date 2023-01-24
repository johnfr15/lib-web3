import { ethers } from "ethers";
import { PROVIDER } from "./constant";

export const getGasPrice = async(): Promise<ethers.BigNumber> => {

  const gasPrice = await PROVIDER.getGasPrice()
  console.log("gas price in gwei", ethers.utils.formatUnits(gasPrice, "gwei"))

  return gasPrice
}

export const hoursPassed = (timestamp: number): number => {
  let blockDate = new Date(timestamp * 1000);
  let currentDate = new Date();
  let diff = currentDate.getTime() - blockDate.getTime();
  let hoursPassed = Math.floor(diff / (1000 * 60 * 60));
  return hoursPassed;
}

// Give delta in Days/Hours/Minutes/Seconds 
export const getDelta = (timestamp: number): {days: number, hours: number, minutes: number, seconds: number, timestamp: number} => {
  let blockDate = new Date(timestamp);
  let currentDate = new Date();
  let diff = currentDate.getTime() - blockDate.getTime();

  let daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff = diff % (1000 * 60 * 60 * 24);
  let hoursPassed = Math.floor(diff / (1000 * 60 * 60));
  diff = diff % (1000 * 60 * 60);
  let minutesPassed = Math.floor(diff / (1000 * 60));
  diff = diff % (1000 * 60);
  let secondsPassed = Math.floor(diff / 1000);

  return {days: daysPassed, hours: hoursPassed, minutes: minutesPassed, seconds: secondsPassed, timestamp: timestamp}
}


// DATA
// parcel 2762
/*
0x9fefe5470000000000000000000000000000000000000000000000000000000000000aca
          00000000000000000000000000000000000000000000000000000000000024a7
          0000000000000000000000000000000000000000000000000000000000000060
          0000000000000000000000000000000000000000000000000000000000000041
          7a1ffec32fbc8a5929bdbb3aeaa83007f283b0cbcf8935bf19ba801fa1901961
          6ac3f73919ff97bc6818abddb7e31ac41f5b993c1d8d01aafce6c8c65ae987a0
          1b00000000000000000000000000000000000000000000000000000000000000
 */
/*
0x9fefe5470000000000000000000000000000000000000000000000000000000000000aca
          0000000000000000000000000000000000000000000000000000000000001d49
          0000000000000000000000000000000000000000000000000000000000000060
          0000000000000000000000000000000000000000000000000000000000000041
          2aa2bc39943ab619026f5cd5ffab665bc0a6662176b0264dc0377b248c0ed796
          573b083d4ac28ad9c0f18b9067c06d33d9c581e76feee811fe3d31e00fb3c36d
          1b00000000000000000000000000000000000000000000000000000000000000 
*/
/* 
0x8027870e0000000000000000000000000000000000000000000000000000000000000aca
          0000000000000000000000000000000000000000000000000000000000001d49
          0000000000000000000000000000000000000000000000000000000000000080
          0000000000000000000000000000000000000000000000000000000000000041
          e9cd203cab75aeab3706f956f33eb1c554554fb361ee7aa4a64347698a0b1ad9
          1004e6efb70aa31d9f3ef011248c4493efc921f60b27c4516b0f7e1f6c9802e6
          1c00000000000000000000000000000000000000000000000000000000000000
*/

// parcel 2762

export const sig = {"0":122,"1":31,"2":254,"3":195,"4":47,"5":188,"6":138,"7":89,"8":41,"9":189,"10":187,"11":58,"12":234,"13":168,"14":48,"15":7,"16":242,"17":131,"18":176,"19":203,"20":207,"21":137,"22":53,"23":191,"24":25,"25":186,"26":128,"27":31,"28":161,"29":144,"30":25,"31":97,"32":106,"33":195,"34":247,"35":57,"36":25,"37":255,"38":151,"39":188,"40":104,"41":24,"42":171,"43":221,"44":183,"45":227,"46":26,"47":196,"48":31,"49":91,"50":153,"51":60,"52":29,"53":141,"54":1,"55":170,"56":252,"57":230,"58":200,"59":198,"60":90,"61":233,"62":135,"63":160,"64":27}

export const serializeSig = (signature: Object) => {
  let arr: any = Object.values(signature)
  console.log("Sig array: ", arr)
  console.log("length: ", arr.length)

  // hexlify
  arr = ethers.utils.hexlify(arr)
  console.log(arr)
  //strip
  arr = ethers.utils.stripZeros(arr)
  console.log(arr)
}

