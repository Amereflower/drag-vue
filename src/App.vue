<template>
  <div id="app">

    <el-menu class="el-menu-demo" mode="horizontal" @select="changePage">
      <el-submenu index="4">
        <template slot="title">切换培养计划</template>
        <el-menu-item index="2">计算机科学与技术</el-menu-item>
        <el-menu-item index="2-2">allTranPlan</el-menu-item>
        <el-menu-item index="2-3">v-for</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="line"></div>
    <el-button style="margin-top:10px;float:left" size="small" @click="exportExcel" v-if="showIndex===2">导出Excel
    </el-button>

    <tagSelect v-if="tagSelectView_Class" :module_Tag="moduledata" :tagFlag="tagFlag_Class" :tagArr="tagArr" :firstPosition="firstPosition_Class" type="class"></tagSelect>
    <tagSelect v-if="tagSelectView_Model" :module_Tag="moduledata" :tagFlag="tagFlag_Model" :tagArr="tagArr" :firstPosition="firstPosition_Model" type="model"></tagSelect>

    <el-button size="small" style="margin-top:10px;float: left;margin-left: 10px" @click="tagChange_Model">模块标签统计
    </el-button>
    <el-button size="small" style="margin-top:10px;float: left;margin-left: 10px" @click="tagChange_CLass">课程标签统计
    </el-button>

    <el-button @click="totree" size="small" style="float:left;margin-top:10px;margin-left: 10px">totree</el-button>

    <appDrag :treeData="treeData" :drop="drop" v-if="showIndex==2" style="clear:both"></appDrag>
  </div>
</template>

<script>
import appDrag from './components/appDrag.vue'
import tagSelect from './components/tagSelect'
import {export2Excel} from './components/util.js'

export default {
  name: 'App',
  components: {
    // draggable,
    tagSelect,
    appDrag
  },
  created: function () {
    this.totree() // 接口失效时调用
    // this.getmodule();  //接口正常时对接
  },
  methods: {
    complexCaculate (tagArr) {
      let Allcredits, Allhours, Allexperiment, Alltheory
      // 总学分，总学时，实验学时，理论学时。
      for (let i = 0; i < this.moduledata.length; i++) {
        for (let j = 0; j < tagArr.length; j++) {
          if (this.moduledata[i].tag.split(';').indexOf(tagArr[j]) !== -1) {
            // 以上操作也可以用接口替代，有接口返回查询带tag的所有课程数据
            this.getData(index)// 每一个模块对应一个或者多个tag，拿到这些模块的id，与coursedata里面做比较筛选数据
            // 通过判断所有课程的parentid和输入的参数index是否相等，如果相等就实现相关数据的运算得到返回结果。
            // 但是每一个tag返回的数据只有四个值，无论它对应几个模块，对应多个模块需要多次调用函数，要考虑返回值相加等问题

            // 这里是模块标签，课程标签简单很多。相当于直接拿到了index，不过是标签，只需要split一下再对比就可以了
          }
        }
      }
    },
    getData (index) {
      let retCre = 0
      let rethour = 0
      let retExe = 0
      let retTheory = 0
      for (let i = 0; i < this.coursedata.length; i++) {
        // 课程的模块父节点如果是待查询的，就相加。
        if (this.coursedata[i].mod_parent_id === index) {
          retCre += this.coursedata[i].credits
          rethour += this.coursedata[i].total_hour
          retExe = retExe + this.coursedata[i].total_hour - this.coursedata[i].teacher_hour
          retTheory += this.coursedata[i].teacher_hour
        }
      }
    },
    getDataByCouTag (tag) {
      // 根据tag算出各个统计数据
      let retCre = 0
      let rethour = 0
      let retExe = 0
      let retTheory = 0
      for (let i = 0; i < this.coursedata.length; i++) {
        if (this.coursedata[i].tag.split(';').indexOf(tag) !== -1) {
          retCre += this.coursedata[i].credits
          rethour += this.coursedata[i].total_hour
          retExe = retExe + this.coursedata[i].total_hour - this.coursedata[i].teacher_hour
          retTheory += this.coursedata[i].teacher_hour
        }
      }
      const ret = {
        retCre: retCre
        // ...retTheory,...retCre,...rethour
      }
      return ret// 把数据返回，渲染到组件上去.
    },

    tagChange_CLass () {
      this.tagSelectView_Class = !this.tagSelectView_Class
    },
    tagChange_Model () {
      this.tagSelectView_Model = !this.tagSelectView_Model
    },
    timeCacTag (tag) {
      // 从后端查询所有的该tag的课程，加分返回数据
      return 3
    },
    creCacTag (tag) {
      return 5
    },
    changePage (key) {
      console.log(key)
      this.showIndex = key
      console.log(this.showIndex + ' is showIndex')
    },
    update (data) {
      alert('ok' + data)
    },
    // 初始化processedTreeData
    initProcessedTreeData (treeData, layerNumber) {
      let processedTreeData = []
      for (let i = 0; i < treeData.length; i++) {
        // 生成一个treeData[i].classTable长度一样的布尔数组
        let boolArr = new Array(treeData[i].classTable.length).fill(false)// 为假则表示未写过
        let tempArr = this.initProcessedTreeData(treeData[i].childArr, layerNumber + 1)
        let tempSum = 0
        if (treeData[i].classTable.length !== 0) { // 说明本层是叶子节点的上一层，则只需要计算本层下课程的总数为tempSum即可
          tempSum = treeData[i].classTable.length
        } else { // 如果当前层下没有课程，则说明不是叶子节点的上一层，则高度需要通过下一层非叶子节点的height之和来计算
          for (let j = 0; j < tempArr.length; j++) {
            tempSum += tempArr[j].height
          }
        }
        processedTreeData.push({
          childArr: tempArr,
          childcredits: treeData[i].childcredits,
          childtime: treeData[i].childtime,
          classTable: treeData[i].classTable,
          classTableWrittenArr: boolArr,
          expect_score: treeData[i].expect_score,
          mod_parent_id: treeData[i].mod_parent_id,
          module_eid: treeData[i].module_eid,
          name: treeData[i].name,
          startRow: 0,
          height: tempSum,
          layerNumber: '' + layerNumber
        })
      }
      return processedTreeData
    },
    // 对treeData进行预处理，在保留每个节点原有信息的前提下，对非叶子节点增加一个应该开始的高度以及应该拥有的高度，对叶子节点增加一个是否已经写过的flag
    treeDataPretreatment (processedTreeData, tempStart) {
      for (let i = 0; i < processedTreeData.length; i++) {
        processedTreeData[i].startRow = tempStart
        if (processedTreeData[i].childArr.length !== 0) {
          this.treeDataPretreatment(processedTreeData[i].childArr, tempStart)
        }
        tempStart += processedTreeData[i].height // 主要计算startRow
      }
    },
    getEachRow (processedTreeData, i, tempArr) {
      for (let j = 0; j < processedTreeData.length; j++) {
        // console.log('startRow', processedTreeData[j])
        if (processedTreeData[j].startRow + processedTreeData[j].height > i && processedTreeData[j].startRow <= i) { // 如果超过高度或者没到startRow，接下去的分支将不用再遍历（剪枝）
          if (processedTreeData[j].startRow === i) { // 首先写上名字
            tempArr[processedTreeData[j].layerNumber] = processedTreeData[j].name
          } else {
            tempArr[processedTreeData[j].layerNumber] = ''
          }
          // tempArr[processedTreeData[j].layerNumber] = processedTreeData[j].name
          // console.log('processedTreeData', processedTreeData)
          if (processedTreeData[j].classTable.length === 0) { // 说明不是叶子节点的上一层，当前层没有课程，则需要继续遍历
            this.getEachRow(processedTreeData[j].childArr, i, tempArr) // 再去遍历下一层
          } else { // 这一层就是叶子节点的上一层，需要进行写入具体课程
            for (let k = 0; k < processedTreeData[j].classTableWrittenArr.length; k++) { // 写入课程
              if (processedTreeData[j].classTableWrittenArr[k] === false) { // 如果当前课程还没有写过，则写入
                tempArr[(Number(processedTreeData[j].layerNumber) + 1) + ''] = processedTreeData[j].classTable[k].code
                tempArr[(Number(processedTreeData[j].layerNumber) + 2) + ''] = processedTreeData[j].classTable[k].name
                tempArr[(Number(processedTreeData[j].layerNumber) + 3) + ''] = processedTreeData[j].classTable[k].englishName
                tempArr[(Number(processedTreeData[j].layerNumber) + 4) + ''] = processedTreeData[j].classTable[k].credits
                tempArr[(Number(processedTreeData[j].layerNumber) + 5) + ''] = processedTreeData[j].classTable[k].total_hour
                tempArr[(Number(processedTreeData[j].layerNumber) + 6) + ''] = processedTreeData[j].classTable[k].teacher_hour
                tempArr[(Number(processedTreeData[j].layerNumber) + 7) + ''] = processedTreeData[j].classTable[k].practice_hour
                tempArr[(Number(processedTreeData[j].layerNumber) + 8) + ''] = processedTreeData[j].classTable[k].experiment_hour
                tempArr[(Number(processedTreeData[j].layerNumber) + 9) + ''] = processedTreeData[j].classTable[k].in_class
                tempArr[(Number(processedTreeData[j].layerNumber) + 10) + ''] = processedTreeData[j].classTable[k].out_class
                tempArr[(Number(processedTreeData[j].layerNumber) + 11) + ''] = processedTreeData[j].classTable[k].term
                tempArr[(Number(processedTreeData[j].layerNumber) + 12) + ''] = processedTreeData[j].classTable[k].exam
                tempArr[(Number(processedTreeData[j].layerNumber) + 13) + ''] = processedTreeData[j].classTable[k].start
                tempArr[(Number(processedTreeData[j].layerNumber) + 14) + ''] = processedTreeData[j].classTable[k].remark
                processedTreeData[j].classTableWrittenArr[k] = true
                return // 写入一个课程之后直接返回
              }
            }
          }
          return // 写完一个模块后直接返回
        }
      }
    },
    getMergeList (excelList) {
      let mergeList = []
      let tempArr = []
      let tempTempArr = []
      let i
      let j
      // 先将excelList转置
      for (i = 1; i < 18; i++) {
        tempTempArr = []
        for (j = 0; j < excelList.length; j++) {
          tempTempArr.push(excelList[j][i])
        }
        tempArr.push(tempTempArr)
      }
      for (i = 0; i < tempArr.length; i++) {
        j = 0
        while (j < tempArr[i].length) {
          if (tempArr[i][j] !== '') {
            let tempObj = {}
            tempObj.s = {c: i, r: j + 1}
            let k = j + 1
            while (tempArr[i][k] === '' && k < tempArr[i].length) {
              k++
            }
            tempObj.e = {c: i, r: k}
            mergeList.push(tempObj)
            j = k
          }
        }
      }
      return mergeList
    },
    getExcelList (processedTreeData) {
      let excelList = []
      let tempArr = {
        '1': '',
        '2': '',
        '3': '',
        '4': '',
        '5': '',
        '6': '',
        '7': '',
        '8': '',
        '9': '',
        '10': '',
        '11': '',
        '12': '',
        '13': '',
        '14': '',
        '15': '',
        '16': '',
        '17': ''
      }
      for (let i = 0; i < processedTreeData[0].height; i++) {
        this.getEachRow(processedTreeData[0].childArr, i, tempArr)
        excelList.push(tempArr)
        if (excelList.length === 22) {
          console.log()
        }
        tempArr = {
          '1': '',
          '2': '',
          '3': '',
          '4': '',
          '5': '',
          '6': '',
          '7': '',
          '8': '',
          '9': '',
          '10': '',
          '11': '',
          '12': '',
          '13': '',
          '14': '',
          '15': '',
          '16': '',
          '17': ''
        }
      }
      return excelList
    },
    exportExcel () {
      console.log('hhh', this.treeData)
      let columns = [
        {title: '课程类别', key: '1'},
        {title: '模块性质', key: '2'},
        {title: '模块', key: '3'},
        {title: '课程代码', key: '4'},
        {title: '课程名称', key: '5'},
        {title: '课程英文名称', key: '6'},
        {title: '学分', key: '7'},
        {title: '总学时', key: '8'},
        {title: '讲授', key: '9'},
        {title: '课程实践', key: '10'},
        {title: '实验', key: '11'},
        {title: '课内上机', key: '12'},
        {title: '课外上机', key: '13'},
        {title: '开课学期', key: '14'},
        {title: '考核方式', key: '15'},
        {title: '起始周', key: '16'},
        {title: '备注', key: '17'}
      ]
      // let mergeArr = [
      //   // s：开始start
      //   // e：结束end
      //   // r：行row
      //   // c: 列columns
      //   {s: {r: 0, c: 1}, e: {r: 0, c: 2}}, // 第一行，第二列到第三列合并
      //   {s: {r: 0, c: 3}, e: {r: 0, c: 4}} // 第一行，第三列到第四列合并
      // ]
      // 对treeData进行预处理，在保留每个节点原有信息的前提下，对非叶子节点增加一个应该开始的高度以及应该拥有的高度，对叶子节点增加一个是否已经写过的flag
      let processedTreeData = this.initProcessedTreeData(this.treeData, 0)
      this.treeDataPretreatment(processedTreeData, 0)
      console.log('aaa', processedTreeData)
      let excelList = this.getExcelList(processedTreeData)
      console.log('excelList', excelList)
      let mergeArr = this.getMergeList(excelList)
      // let mergeArr = []
      console.log('mergeArr', mergeArr)
      // let list = [{courseName: '语文', moduleName: '语文1', lessonName: '语文1-1'},
      //   {courseName: '语文', moduleName: '语文1', lessonName: '语文1-2'} ]
      export2Excel(columns, excelList, '培养计划', mergeArr)
    },
    setNewCourse (Cparams) {
      this.$axios.post('http://trainingplan.rzcloud.online/startcourse', (Cparams))
        .then(res => {
          // res.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    setNewModule (Mparams) {

    },
    editCpar (cou_id, par_id) {
      const params = {
        'course_eid': cou_id,
        'cou_parent_id': par_id
      }
      this.$axios.post('http://trainingplan.rzcloud.online/dropcourse', (params))
        .then(res => {
          // res.data.data
          console.log('已将' + cou_id + '的父亲改为' + par_id)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getcourse () {
      this.$axios({
        url: 'http://trainingplan.rzcloud.online/allcourses',
        method: 'get'
      })
        .then(response => {
          console.log(response.data)
          this.coursedata = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getmodule () {
      this.moduledata = []
      this.$axios({
        url: 'http://trainingplan.rzcloud.online/module',
        method: 'get'
      })
        .then(response => {
          console.log('-----------这是接口返回的数据----------------')
          console.log(response.data.data)
          console.log('---------------------------')
          this.moduledata = response.data.data
          console.log(typeof (this.moduledata) + ' this is type')
          console.log(this.moduledata.length + ' i am length ')
          this.totree()
        })
        .catch(error => {
          console.log(error)
        })
    },
    totree () {
      console.log("这里是totree方法",this.moduledata)
      for (let j = 0; j < this.moduledata.length; j++) {
        // this.moduledata[j]['classTable'] = []
        this.moduledata[j]['classTable'] = this.moduledata[j]['lessonArr']
        this.moduledata[j]['childArr'] = []
        if(typeof(this.moduledata[j]['tag'])==="string")
          this.moduledata[j]['tag'] = this.moduledata[j]['tag'].split(';')
        this.moduledata[j]['inputVisible'] = false
        this.moduledata[j]['inputValue'] = ''
        for (let i = 0; i < this.moduledata[j]['tag'].length; i++) {
          if (this.tagArr.indexOf(this.moduledata[j]['tag'][i]) === -1) { this.tagArr.push(this.moduledata[j]['tag'][i]) }
        }

        // this.moduledata[j]['addCourseForm']={
        //  //把el-dialog绑定到这里
        // }
        if (this.moduledata[j].lessonArr.length > 0) {
          for (let i = 0; i < this.moduledata[j].lessonArr.length; i++) {
            this.moduledata[j].lessonArr[i]['normal'] = true
            this.moduledata[j].lessonArr[i]['editable'] = false
            this.moduledata[j].lessonArr[i]['delview'] = false
            // tag在这里处理
            if(typeof(this.moduledata[j].lessonArr[i]['tag'])==="string")
             this.moduledata[j].lessonArr[i]['tag'] = this.moduledata[j].lessonArr[i]['tag'].split(';')
            // 把"tag":"favarite;hate"转变成"tag":[favarate,hate]的数组。
            // 删除的时候发请求+在这里删除页面上显示。
          }
        }

        this.moduledata[j]['fromshow'] = false// dialog无法连接到这里，因为是多个嵌套的复杂原因
      }


      for (let i = 0; i < this.moduledata.length; i++) {
        let allTeach = this.moduledata[i].classTable.reduce(
          (sum, e) => sum + Number(e.teacher_hour || 0),
          0
        );
        let alltime = this.moduledata[i].classTable.reduce(
          (sum, e) => sum + Number(e.total_hour || 0),
          0
        )
        let allcredits = this.moduledata[i].classTable.reduce(
          (sum, e) => sum + Number(e.credits || 0),
          0
        )
        let outClass = this.moduledata[i].classTable.reduce(
          (sum, e) => sum + Number(e.out_class || 0),
          0
        )
        let allExe = alltime-allTeach;//总实践学时
        this.moduledata[i]['childcredits'] = allcredits
        this.moduledata[i]['childtime'] = alltime
        this.moduledata[i]['childteach'] = allTeach             //理论学时
        this.moduledata[i]['childexper'] = alltime-allTeach+outClass  //实践学时
        if (alltime > 0)
          this.transferData(i, alltime, allcredits,allTeach,alltime-allTeach+outClass)
      }// 将每个模块的分数上传，仅仅是自己模块，不包括自己子模块的模块分，比如计算机科学与技术就是0


      console.log('+++++++++++这是修改过后的数据，但没有形成树状结构+++++++++++++++')
      console.log(this.moduledata)
      console.log('++++++++++++++++++++++++++')
      if (this.moduledata[0] !== null)
        this.testdata.push(this.moduledata[0])
      console.log(this.moduledata[0] + "这就是第一个treedata")
      this.treeData = this.getChildTreeData(this.moduledata, this.testdata)

	  // this.treeData = this.testdata
      console.log('******这是形成的树形结构******')
      console.log(this.treeData)
      console.log('************')


      console.log("**************************")
      console.log(this.treeData)
      console.log("------------------------")
      return
    },
    findNumner(n) {
      for (let i = 0; i < this.moduledata.length; i++) {
        if (this.moduledata[i].module_eid === n)
          return i;
      }
    },
    unique (arr) {
      return Array.from(new Set(arr))
    },
    transferData(index, addtime, addcredits,addteach,addexper) {
      let parid = this.moduledata[index].mod_parent_id
      if (parid === null)
        return;
      else {
        let par_mod_id
        for (let j = 0; j < this.moduledata.length; j++) {
          if (this.moduledata[j].module_eid === parid) {
            this.moduledata[j].childcredits += addcredits
            this.moduledata[j].childtime += addtime
            this.moduledata[j].childteach += addteach
            this.moduledata[j].childexper += addexper
            par_mod_id = j
          }
        }

        if (this.moduledata[par_mod_id].mod_parent_id !== null) {
          this.transferData(par_mod_id, addtime, addcredits,addteach,addexper)
        }
      }
    }, // 自下向上传递自己的模块分数
    getChildTreeData (tableData, treeData) {
      // 先遍历treeData,找到每个节点的子节点
      treeData.forEach(item => {
        tableData.forEach(item2 => {
          if (item.module_eid === item2.mod_parent_id) {
            item.childArr.push({
              module_eid: item2.module_eid,
              name: item2.name,
              mod_parent_id: item2.mod_parent_id,
              expect_score: item2.expect_score,
              classTable: item2.classTable,
              childArr: item2.childArr,
              childcredits: item2.childcredits,
              childtime: item2.childtime,
              childteach:item2.childteach,
              childexper:item2.childexper,
              tag: item2.tag,
              inputVisible: false,
              inputValue: ''
            })
          }
        })
        this.getChildTreeData(tableData, item.childArr)
      })
      return treeData
    }
  },
  data () {
    return {
      firstPosition_Class: {
      right: 100,
        top: 50
      },
      firstPosition_Model: {
        right: 100,
        top: -150
      },
      tagSelectView_Model: false,
      tagSelectView_Class: false,
      treeData_Tag_Class: {},
      treeData_Tag_Model: {},
      tagFlag_Class: false,
      tagFlag_Model: false,
      // tagArr: ['必修课', '选修课', '体育课', '通识课', '勾八课', '体育课', '篮球课', '足球课', '羽毛球课', '乒乓球课', '网球课', '跆拳道课', '健身课', '游泳课', '舞蹈课', '其他体育课', '其他课'],
      tagArr: [],
      drop: {
        dropmodule: {
          module_eid: 0,
          mod_parent_id: 0
        },
        dropcourse: {
          course_eid: 0,
          cou_parent_id: 0
        }
      },
      allTags: ['a', 'b', 'c', 'f', 'g', 'r'],//记录所有的tag值
      showIndex: 2,
      testdata: [],
      moduledata: [
        {
          "module_eid": 1,
          "name": "计算机科学与技术",
          "mod_parent_id": null,
          "expect_score": null,
          "lessonArr": [],
          "tag": "必修课;选修课"
        },
        {
          "module_eid": 2,
          "name": "通识公共课",
          "mod_parent_id": 1,
          "expect_score": null,
          "lessonArr": [],
          "tag": "必修课;通识课"
        },
        {
          "module_eid": 3,
          "name": "学科专业课",
          "mod_parent_id": 1,
          "expect_score": null,
          "lessonArr": [],
          "tag": "篮球课;体育课"
        },
        {
          "module_eid": 4,
          "name": "实践教学环节",
          "mod_parent_id": 1,
          "expect_score": null,
          "lessonArr": [],
          "tag": "必修课;篮球课"
        },
        {
          "module_eid": 5,
          "name": "专业课",
          "mod_parent_id": 1,
          "expect_score": null,
          "lessonArr": [],
          "tag": "必修课;足球课"
        },
        {
          "module_eid": 6,
          "name": "课外教育项目",
          "mod_parent_id": 1,
          "expect_score": null,
          "lessonArr": [],
          "tag": "必修课;选修课"
        },
        {
          "module_eid": 7,
          "name": "通识必修",
          "mod_parent_id": 2,
          "expect_score": null,
          "lessonArr": [],
          "tag": "必修课;篮球课"
        },
        {
          "module_eid": 8,
          "name": "学科必修",
          "mod_parent_id": 3,
          "expect_score": null,
          "lessonArr": [],
          "tag": "必修课;选修课"
        },
        {
          "module_eid": 9,
          "name": "实践必修",
          "mod_parent_id": 4,
          "expect_score": null,
          "lessonArr": [],
          "tag": "必修课;足球课"
        },
        {
          "module_eid": 11,
          "name": "专业选修",
          "mod_parent_id": 5,
          "expect_score": null,
          "lessonArr": [],
          "tag": "健身课;跆拳道课"
        },
        {
          "module_eid": 12,
          "name": "课外教育项目",
          "mod_parent_id": 6,
          "expect_score": null,
          "lessonArr": [],
          "tag": "必修课;选修课"
        },
        {
          "tag": "创新课;实践课",
          "module_eid": 13,
          "name": "35学分",
          "mod_parent_id": 7,
          "expect_score": null,
          "lessonArr": [
            {
              "tag": "必修课程;通识必修",
              "code": "A2301210",
              "name": "中国近现代史纲领",
              "englishName": "The Outline of Modern and Contemporary History of China",
              "credits": "3",
              "total_hour": "48",
              "teacher_hour": "42",
              "practice_hour": "6",
              "experiment_hour": "",
              "in_class": "",
              "out_class": "",
              "term": "2",
              "exam": "Y",
              "start": "1月16日",
              "remark": "",
              "cou_parent_id": 13
            },
            {
              "tag": "必修课程;通识必修",
              "code": "A2301260",
              "name": "思想道德与法治",
              "englishName": "Ideological and  Moral Cultivation and Rule of Law",
              "credits": "3",
              "total_hour": "48",
              "teacher_hour": "42",
              "practice_hour": "6",
              "experiment_hour": null,
              "in_class": null,
              "out_class": null,
              "term": "1",
              "exam": "Y",
              "start": "1月16日",
              "remark": null,
              "cou_parent_id": 13
            },
            {
              "tag": "必修课程;通识必修",
              "code": "T1301011",
              "name": "体育1",
              "englishName": "Physical Education1",
              "credits": "1",
              "total_hour": "32",
              "teacher_hour": "4",
              "practice_hour": "28",
              "experiment_hour": null,
              "in_class": null,
              "out_class": null,
              "term": "1",
              "exam": "C",
              "start": "1月16日",
              "remark": null,
              "cou_parent_id": 13
            },

          ]
        },
        {
          "tag": "标记课;选修课",
          "module_eid": 14,
          "name": "13学分",
          "mod_parent_id": 8,
          "expect_score": null,
          "lessonArr": [
            {
              "tag": "必修课程;专业必修",
              "code": "A0501180",
              "name": "程序设计基础",
              "englishName": "Basis of Programming",
              "credits": "4",
              "total_hour": "64",
              "teacher_hour": "48",
              "practice_hour": null,
              "experiment_hour": null,
              "in_class": "16",
              "out_class": null,
              "term": "1",
              "exam": "X",
              "start": "1月16日",
              "remark": null,
              "cou_parent_id": 14
            },
            {
              "tag": "必修课程;专业必修",
              "code": "A0512020",
              "name": "计算机类学科导论",
              "englishName": "Introduction to Computer Science",
              "credits": "1",
              "total_hour": "16",
              "teacher_hour": "16",
              "practice_hour": null,
              "experiment_hour": null,
              "in_class": null,
              "out_class": null,
              "term": "1",
              "exam": "C",
              "start": "1月16日",
              "remark": null,
              "cou_parent_id": 14
            },

          ]
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 15,
          "name": "1学分",
          "mod_parent_id": 9,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 16,
          "name": "25.5学分",
          "mod_parent_id": 7,
          "expect_score": null,
          "lessonArr": [
            {
              "tag": "必修课程;通识必修",
              "code": "A2301240",
              "name": "马克思主义基本原理",
              "englishName": "Basic Principles of Marxism",
              "credits": "3",
              "total_hour": "48",
              "teacher_hour": "42",
              "practice_hour": "6",
              "experiment_hour": null,
              "in_class": null,
              "out_class": null,
              "term": "6",
              "exam": "Y",
              "start": "1月16日",
              "remark": null,
              "cou_parent_id": 16
            },
            {
              "tag": "必修课程;通识必修",
              "code": "T1301013",
              "name": "体育3",
              "englishName": "Physical Education3",
              "credits": "1",
              "total_hour": "32",
              "teacher_hour": "4",
              "practice_hour": "28",
              "experiment_hour": null,
              "in_class": null,
              "out_class": null,
              "term": "3",
              "exam": "C",
              "start": "1月16日",
              "remark": null,
              "cou_parent_id": 16
            },

          ]
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 17,
          "name": "16学分",
          "mod_parent_id": 8,
          "expect_score": null,
          "lessonArr": [
            {
              "tag": "必修课程;专业必修",
              "code": "A0512040",
              "name": "计算机网络",
              "englishName": "Computer Network ",
              "credits": "4",
              "total_hour": "64",
              "teacher_hour": "64",
              "practice_hour": null,
              "experiment_hour": null,
              "in_class": null,
              "out_class": null,
              "term": "5",
              "exam": "X",
              "start": "1月16日",
              "remark": null,
              "cou_parent_id": 17
            }
          ]
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 20,
          "name": "物联网工程模块",
          "mod_parent_id": 11,
          "expect_score": null,
          "lessonArr": [
            {
              "tag": "必修课程;专业必修",
              "code": "B050801s",
              "name": "物联网工程导论",
              "englishName": "Introduction to IoT Enginneering ",
              "credits": "2",
              "total_hour": "32",
              "teacher_hour": "32",
              "practice_hour": null,
              "experiment_hour": null,
              "in_class": null,
              "out_class": null,
              "term": "3",
              "exam": "C",
              "start": "1月16日",
              "remark": "双语",
              "cou_parent_id": 20
            },
            {
              "tag": "必修课程;专业必修",
              "code": "B050816s",
              "name": "传感器与传感网",
              "englishName": "Sensor and Sensor Networks",
              "credits": "2",
              "total_hour": "32",
              "teacher_hour": "16",
              "practice_hour": null,
              "experiment_hour": "16",
              "in_class": null,
              "out_class": null,
              "term": "4",
              "exam": "C",
              "start": "1月16日",
              "remark": "双语",
              "cou_parent_id": 20
            }
          ]
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 21,
          "name": "人工智能模块",
          "mod_parent_id": 11,
          "expect_score": null,
          "lessonArr": [
            {
              "tag": "必修课程;专业选修",
              "code": "B0501540",
              "name": "人工智能导论",
              "englishName": "Introduction to Artificial Intelligence",
              "credits": "2",
              "total_hour": "32",
              "teacher_hour": "32",
              "practice_hour": null,
              "experiment_hour": null,
              "in_class": null,
              "out_class": "24",
              "term": "3",
              "exam": "C",
              "start": "1月16日",
              "remark": null,
              "cou_parent_id": 21
            },
            {
              "tag": "必修课程;专业选修",
              "code": "B050155s",
              "name": "机器学习",
              "englishName": "Machine Learning",
              "credits": "2",
              "total_hour": "32",
              "teacher_hour": "32",
              "practice_hour": null,
              "experiment_hour": null,
              "in_class": null,
              "out_class": "24",
              "term": "4",
              "exam": "C",
              "start": "1月16日",
              "remark": "双语",
              "cou_parent_id": 21
            }
          ]
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 22,
          "name": "数据科学模块",
          "mod_parent_id": 11,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 23,
          "name": "网络安全模块",
          "mod_parent_id": 11,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 24,
          "name": "公共模块",
          "mod_parent_id": 11,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 25,
          "name": "31.5学分",
          "mod_parent_id": 9,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 26,
          "name": "7学分",
          "mod_parent_id": 12,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 27,
          "name": "通识选修",
          "mod_parent_id": 2,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 28,
          "name": "3学分",
          "mod_parent_id": 27,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 29,
          "name": "通识选修课",
          "mod_parent_id": 1,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 30,
          "name": "10学分",
          "mod_parent_id": 27,
          "expect_score": null,
          "lessonArr": []
        },
        {
          "tag": "必修课;选修课",
          "module_eid": 84,
          "name": "16学分",
          "mod_parent_id": 32,
          "expect_score": 0,
          "lessonArr": []
        }
      ],
      treeData: [
        {
          childcredits: 210, // 字菜单已经有的学分数
          childtime: 1232, // 子菜单已经有的学时数字。
          // 数据在前端处理。
          module_eid: 0,
          name: '计算机科学与技术',
          classTable: [
            {
              inputVisible:false,
              inputValue:'',
              tag:['a','b'],
              normal: true, // 标记是否为标准课程
              editable: false, // 标记当前是否可编辑
              module_eid: 13,
              name: '中国近现代史纲要',
              mod_parent_id: 7, // 形成树形关系
              expect_score: null, // 标记特殊情况
              course_eid: 87,
              code: 'A2301210',
              englishName:
                'The Outline of Modern and Contemporary History of China',
              credits: '3',
              total_hour: '48',
              teacher_hour: '42',
              practice_hour: '6',
              experiment_hour: null,
              in_class: null,
              out_class: null,
              term: '2',
              exam: 'Y',
              start: '1月16日',
              remark: null,
              cou_expect_score: null,
              on_group: null,
              cou_parent_id: 13 // 课程父级目录id
            },
            {
              inputVisible:false,
              inputValue:'',
              tag:['a','c'],
              editable: false,
              normal: true,
              module_eid: 13,
              name: '思想道德与法治',
              mod_parent_id: 7,
              expect_score: null,
              course_eid: 88,
              code: 'A2301260',
              englishName: 'Ideological and  Moral Cultivation and Rule of Law',
              credits: '3',
              total_hour: '48',
              teacher_hour: '42',
              practice_hour: '6',
              experiment_hour: null,
              in_class: null,
              out_class: null,
              term: '1',
              exam: 'Y',
              start: '1月16日',
              remark: null,
              cou_expect_score: null,
              on_group: null,
              cou_parent_id: 13
            },
            {
              inputVisible:false,
              inputValue:'',
              tag:['a','e'],
              editable: false,
              normal: true,
              module_eid: 13,
              name: '体育1',
              mod_parent_id: 7,
              expect_score: null,
              course_eid: 89,
              code: 'T1301011',
              englishName: 'Physical Education1',
              credits: '1',
              total_hour: '32',
              teacher_hour: '4',
              practice_hour: '28',
              experiment_hour: null,
              in_class: null,
              out_class: null,
              term: '1',
              exam: 'C',
              start: '1月16日',
              remark: null,
              cou_expect_score: null,
              on_group: null,
              cou_parent_id: 13
            }
          ],
          childArr: [
            {
              module_eid: 1,
              name: '专业必修1-1',
              classTable: [
                {
                  inputVisible:false,
                  inputValue:'',
                  tag:['f','g'],
                  editable: false,
                  normal: true,
                  module_eid: 13,
                  name: '高等数学A1',
                  mod_parent_id: 7,
                  expect_score: null,
                  course_eid: 95,
                  code: 'A0714201',
                  englishName: 'Higher Mathematics A1',
                  credits: '5',
                  total_hour: '80',
                  teacher_hour: '80',
                  practice_hour: null,
                  experiment_hour: null,
                  in_class: null,
                  out_class: null,
                  term: '1',
                  exam: 'X',
                  start: '1月16日',
                  remark: null,
                  cou_expect_score: null,
                  on_group: null,
                  cou_parent_id: 13
                },
                {inputVisible:false,
                  inputValue:'',
                  tag:['f','e'],
                  editable: false,
                  normal: true,
                  module_eid: 13,
                  name: '高等数学A2',
                  mod_parent_id: 7,
                  expect_score: null,
                  course_eid: 96,
                  code: 'A0714202',
                  englishName: 'Higher Mathematics A2',
                  credits: '5',
                  total_hour: '80',
                  teacher_hour: '80',
                  practice_hour: null,
                  experiment_hour: null,
                  in_class: null,
                  out_class: null,
                  term: '2',
                  exam: 'X',
                  start: '1月16日',
                  remark: null,
                  cou_expect_score: null,
                  on_group: null,
                  cou_parent_id: 13
                },
                {
                  inputVisible:false,
                  inputValue:'',
                  tag:['f','r'],
                  editable: false,
                  normal: true,
                  module_eid: 13,
                  name: '线性代数',
                  mod_parent_id: 7,
                  expect_score: null,
                  course_eid: 97,
                  code: 'A0714030',
                  englishName: 'Linear Algebra',
                  credits: '3',
                  total_hour: '48',
                  teacher_hour: '48',
                  practice_hour: null,
                  experiment_hour: null,
                  in_class: null,
                  out_class: null,
                  term: '1',
                  exam: 'X',
                  start: '1月16日',
                  remark: null,
                  cou_expect_score: null,
                  on_group: null,
                  cou_parent_id: 13
                }
              ],
              childArr: [
                {
                  module_eid: 3,
                  name: '专业1-1-1',
                  childArr: [],
                  classTable: [
                    {
                      inputVisible:false,
                      inputValue:'',
                      tag:['f','g'],
                      editable: false,
                      normal: true,
                      module_eid: 14,
                      name: '程序设计基础',
                      mod_parent_id: 8,
                      expect_score: null,
                      course_eid: 102,
                      code: 'A0501180',
                      englishName: 'Basis of Programming',
                      credits: '4',
                      total_hour: '64',
                      teacher_hour: '48',
                      practice_hour: null,
                      experiment_hour: null,
                      in_class: '16',
                      out_class: null,
                      term: '1',
                      exam: 'X',
                      start: '1月16日',
                      remark: null,
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 14
                    },
                    {
                      inputVisible:false,
                      inputValue:'',
                      tag:['f','g'],
                      editable: false,
                      normal: true,
                      module_eid: 14,
                      name: '计算机类学科导论',
                      mod_parent_id: 8,
                      expect_score: null,
                      course_eid: 103,
                      code: 'A0512020',
                      englishName: 'Introduction to Computer Science',
                      credits: '1',
                      total_hour: '16',
                      teacher_hour: '16',
                      practice_hour: null,
                      experiment_hour: null,
                      in_class: null,
                      out_class: null,
                      term: '1',
                      exam: 'C',
                      start: '1月16日',
                      remark: null,
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 14
                    }
                  ],
                },
                {
                  module_eid: 4,
                  name: '专业1-1-2',
                  classTable: [
                    {
                      inputVisible:false,
                      inputValue:'',
                      tag:['f','g'],
                      editable: false,
                      normal: true,
                      module_eid: 13,
                      name: '大学物理1',
                      mod_parent_id: 7,
                      expect_score: null,
                      course_eid: 98,
                      code: 'A0715011',
                      englishName: 'College Physics1',
                      credits: '3',
                      total_hour: '48',
                      teacher_hour: '48',
                      practice_hour: null,
                      experiment_hour: null,
                      in_class: null,
                      out_class: null,
                      term: '2',
                      exam: 'X',
                      start: '1月16日',
                      remark: '注2',
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 13
                    },
                    {
                      inputVisible:false,
                      inputValue:'',
                      tag:['f','g'],
                      normal: true,
                      editable: false,
                      module_eid: 13,
                      name: '物理学原理及工程应用1',
                      mod_parent_id: 7,
                      expect_score: null,
                      course_eid: 99,
                      code: 'A0715051',
                      englishName:
                        'Physics Principle and Engineering Application 1',
                      credits: '3',
                      total_hour: '48',
                      teacher_hour: '48',
                      practice_hour: null,
                      experiment_hour: null,
                      in_class: null,
                      out_class: null,
                      term: '2',
                      exam: 'X',
                      start: '1月16日',
                      remark: '注2',
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 13
                    },
                    {
                      inputVisible:false,
                      inputValue:'',
                      tag:['f','g'],
                      normal: true,
                      editable: false,
                      module_eid: 13,
                      name: '大学生心理健康教育',
                      mod_parent_id: 7,
                      expect_score: null,
                      course_eid: 100,
                      code: 'A2301250',
                      englishName: 'College Students Mental Health Education',
                      credits: '2',
                      total_hour: '32',
                      teacher_hour: '28',
                      practice_hour: '4',
                      experiment_hour: null,
                      in_class: null,
                      out_class: null,
                      term: '2',
                      exam: 'C',
                      start: '1月16日',
                      remark: null,
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 13
                    },
                    {
                      inputVisible:false,
                      inputValue:'',
                      tag:['f','g'],
                      normal: true,
                      editable: false,
                      module_eid: 13,
                      name: '工程伦理',
                      mod_parent_id: 7,
                      expect_score: null,
                      course_eid: 101,
                      code: 'A050163s',
                      englishName: 'Engineering Ethics',
                      credits: '1',
                      total_hour: '16',
                      teacher_hour: '16',
                      practice_hour: null,
                      experiment_hour: null,
                      in_class: null,
                      out_class: null,
                      term: '2',
                      exam: 'C',
                      start: '1月16日',
                      remark: '双语',
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 13
                    }
                  ],
                  childArr: [
                    {
                      module_eid: 2,
                      name: '专业选修1-1-2-1',
                      classTable: [],
                      childArr: []
                    }
                  ],
                }
              ],
            },
            {
              module_eid: 2,
              name: '专业选修1-2',
              classTable: [],
              childArr: [
                {
                  module_eid: 6,
                  name: '选修1-2-1',
                  childArr: [],
                  classTable: [
                    {
                      inputVisible:false,
                      inputValue:'',
                      tag:['f','a'],
                      normal: true,
                      module_eid: 14,
                      editable: false,
                      name: '程序设计基础',
                      mod_parent_id: 8,
                      expect_score: null,
                      course_eid: 102,
                      code: 'A0501180',
                      englishName: 'Basis of Programming',
                      credits: '4',
                      total_hour: '64',
                      teacher_hour: '48',
                      practice_hour: null,
                      experiment_hour: null,
                      in_class: '16',
                      out_class: null,
                      term: '1',
                      exam: 'X',
                      start: '1月16日',
                      remark: null,
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 14
                    },
                    {
                      inputVisible:false,
                      inputValue:'',
                      tag:['f','a'],
                      normal: true,
                      editable: false,
                      module_eid: 14,
                      name: '计算机类学科导论',
                      mod_parent_id: 8,
                      expect_score: null,
                      course_eid: 103,
                      code: 'A0512020',
                      englishName: 'Introduction to Computer Science',
                      credits: '1',
                      total_hour: '16',
                      teacher_hour: '16',
                      practice_hour: null,
                      experiment_hour: null,
                      in_class: null,
                      out_class: null,
                      term: '1',
                      exam: 'C',
                      start: '1月16日',
                      remark: null,
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 14
                    }
                  ],
                },
                {
                  module_eid: 7,
                  name: '选修1-2-2',
                  classTable: [
                    {
                      inputVisible:false,
                      inputValue:'',
                      tag:['f','a'],
                      normal: true,
                      editable: false,
                      module_eid: 14,
                      name: '计算机科学概论',
                      mod_parent_id: 8,
                      expect_score: null,
                      course_eid: 104,
                      code: 'A051201s',
                      englishName: 'A Brief Overview of Computer Science',
                      credits: '1',
                      total_hour: '16',
                      teacher_hour: '16',
                      practice_hour: null,
                      experiment_hour: null,
                      in_class: null,
                      out_class: null,
                      term: '1',
                      exam: 'C',
                      start: '1月16日',
                      remark: '双语',
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 14
                    },
                    {
                      inputVisible:false,
                      inputValue:'',
                      normal: true,
                      editable: false,
                      module_eid: 14,
                      name: '离散数学',
                      mod_parent_id: 8,
                      expect_score: null,
                      course_eid: 105,
                      code: 'A0501520',
                      englishName: 'Discrete Mathematics',
                      credits: '4',
                      total_hour: '64',
                      teacher_hour: '64',
                      practice_hour: null,
                      experiment_hour: null,
                      in_class: null,
                      out_class: null,
                      term: '2',
                      exam: 'Y',
                      start: '1月16日',
                      remark: null,
                      cou_expect_score: null,
                      on_group: null,
                      cou_parent_id: 14
                    }
                  ],
                }
              ],
            }
          ],
        }
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
