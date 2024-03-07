import {View, Text, TextInput, ScrollView, TouchableOpacity, Image} from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useState} from 'react'
import { format, milliseconds } from "date-fns";
import ko from "date-fns/esm/locale/ko/index.js";
import {db} from '../firebaseConfig'
import importanceImg from '../assets/Importance.png'
import unimportanceImg from '../assets/Unimportance.png'

import {
    collection, getDocs,
    doc, setDoc, updateDoc, where, deleteDoc} from "firebase/firestore";

const Today = (props) => {
    const {params} = props.route
    const year = params?params.year:null
    const compareSelectedDate = params? params.selectedDate:format(new Date(), 'yyyy-MM-dd');
    const selectedDate = params? params.selectedDate.replace(year + '-', ''):format(new Date(),'MM-dd');
    //const changeFlag = params?params.changeFlag:false;

    const [time, setTime] = useState(new Date())
    const [visible, setVisible] = useState(false); // 모달 노출 여부
    const [content, setContent] = useState("")
    const [plan, setPlan] = useState([])
    const [importance, setImportance] = useState(false)
    const [importanceImage, setImportanceImage] = useState(unimportanceImg)
    const [flag, setFlag] = useState(true)
    //const [changeFlags, setChangeFlags] = useState(false)

    const sortJSON = function(data, key) {
        return data.sort(function(a, b) {
          var x = a[key];
          var y = b[key];

        return x < y ? -1 : x > y ? 1 : 0;
        });
      };

    const chageImage = () => {
        if (importance) {
            setImportanceImage(unimportanceImg)
            setImportance(false)
        } else {
            setImportanceImage(importanceImg)
            setImportance(true)
        }
    }

    const readfromDB = async() => {
        try{
            const data = await getDocs(collection(db, "plan"))
            
            setPlan(data.docs.map(doc=>(
                {...doc.data(), id: doc.id}
                )))
        } catch(error) {
            console.log(error.message)
        }
    }

    const onChangeInput = (event) => {
        setContent(event)
    }

    //일정 저장
    const onAddPlan = () => {
        var id = new Date().getFullYear().toString() + (new Date().getMonth() + 1).toString() + new Date().getDate().toString() + 
                new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString()
        var con = {
            time : time.getTime(),
            done : 'yet',
            importance : importance,
            contents : content,
            date:compareSelectedDate
        }
        var result = {
            id :id,
            time : time.getTime(),
            done : 'yet',
            importance : importance,
            contents : content,
            date:compareSelectedDate
        }
        setPlan(sortJSON([...plan, result],'id'))
        addtoDB(id,con)
        setContent('')
    }

    const addtoDB = async(id, contents) => {
        try {
            await setDoc(doc(db, 'plan', id,),contents);
        } catch(error) {
            console.log(error.message)
        }
    }

    const onDelete = async (position) => {
        const newArray = plan.filter((num) => {
            return position != num.id;
        })
        setPlan(sortJSON(newArray,'id'))
        try {
            const docRef = doc(db, 'plan',position);
            await deleteDoc(docRef);
        } catch(error) {
            console.log(error.message)
        }
    }

    const onPressTime = () => { // 시간 클릭 시
        setVisible(true); // 모달 open
    };
    const onConfirm = (selectedTime) => { // 날짜 또는 시간 선택 시
        setVisible(false); // 모달 close
        setTime(selectedTime); // 선택한 날짜 변경
    };

    const onCancel = () => { // 취소 시
        setVisible(false); // 모달 close
    };

    const changeplan = (position) => {
        let itemList = []
        plan?.map(async (num) => {
            if (position == num.id) {
                try{
                    const docRef = doc(db, "plan", num.id);
                    if (num.done == 'yet') {
                        itemList.push({
                            id :num.id,
                            time : num.time,
                            done : 'done',
                            importance : num.importance,
                            contents : num.contents,
                            date:compareSelectedDate
                        })
                        await updateDoc(docRef, {
                            done : 'done'
                        });
                    } else if (num.done == 'done'){
                        itemList.push({
                            id :num.id,
                            time : num.time,
                            done : 'yet',
                            importance : num.importance,
                            contents : num.contents,
                            date:compareSelectedDate
                        })
                        await updateDoc(docRef, {
                            done : 'yet'
                        });
                    }
                }catch (error) {
                    console.log(error.message)
                }
            } else {
                itemList.push(num)
            }
        })
        setPlan(itemList)
    }


    if (flag) {
        readfromDB()
        setFlag(false)
    }

    return (
        <View
            style ={{backgroundColor:'#B7E1FF',
                     height:'100%'
            }}
        >   
            
            <Text
                style={{marginTop:'10%'}}
            >
                TODAY : {format(new Date(),'MM/dd')}
            </Text>
            <Text
                style ={{marginTop:"5%", marginLeft:'35%',fontSize:40}}
            >
                {selectedDate}
            </Text>
            
            <View
                style ={{ marginLeft :'3%', backgroundColor:'#FFFFFF',
                        width: '95%', height:'75%', marginTop:'5%',
                        borderRadius:20}}
            >
                <View
                    style = {{flexDirection:'row', marginTop:'5%'}}
                >
                    <TouchableOpacity onPress={onPressTime}>
                        <Text
                            style = {{marginLeft:'10%', marginTop:'5%', fontSize:15}}
                        >clik on your schedule : {format(time, 'hh-mm')}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal 
                        isVisible={visible}
                        mode='time'
                        onConfirm={onConfirm}
                        onCancel={onCancel}
                        date={time}
                    />
                    <TouchableOpacity
                        onPress = {chageImage}
                    >
                        <Image
                            style = {{marginTop:'5%', height:40, width:120}}
                            source = {importanceImage}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style = {{flexDirection:'row', marginTop:'5%'}}
                >
                    <TextInput
                        style = {{marginLeft:'5%',height:'130%', width:'70%',marginRight:'10%'}}
                        value = {content}
                        onChangeText = {onChangeInput}
                    />
                    <TouchableOpacity
                        onPress={() => onAddPlan()}
                    >
                        <Text
                            style={{ fontSize:15}}
                        >add</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        borderBottomColor: '#E9C0C0',
                        borderBottomWidth: 1,
                        marginLeft:'5%',
                        marginRight:'15%',
                        marginTop:'3%'
                    }}
                />
                <ScrollView>
                {plan?.map((item, idx) => {
                    if (compareSelectedDate.split('-')[0] == item.date.split('-')[0]&& 
                            compareSelectedDate.split('-')[1] == item.date.split('-')[1] &&
                            compareSelectedDate.split('-')[2] == item.date.split('-')[2])
                    return(
                        <View
                            style = {{marginTop:'5%'}}
                            key = {idx}
                        >
                            <View
                                style = {{flexDirection:'row'}}
                            >
                                <View
                                    style = {{marginLeft:'5%', width:'60%'}}
                                >
                                    <TouchableOpacity
                                        onPress = {() => changeplan(item.id)}
                                    >
                                        <Text
                                            style = {{color:item.importance?'#FF3F3F':'#000000',
                                                      textDecorationLine: item.done == 'done'?'line-through':''}}
                                        >{item.contents}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text
                                    style = {{marginLeft:'5%'}}
                                >{new Date(item.time).getHours()} : {new Date(item.time).getMinutes()}</Text>
                                <TouchableOpacity
                                    style = {{marginLeft:'3%'}}
                                    onPress = {()=> onDelete(item.id)}
                                >
                                <Text
                                >delete</Text>
                            </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                borderBottomColor: '#E9C0C0',
                                borderBottomWidth: 1,
                                marginLeft:'5%',
                                marginRight:'15%',
                                marginTop:'3%'
                                }}
                            />
                        </View>
                    )
                })}
                </ScrollView>
            </View>
        </View>
    )
}

export default Today;