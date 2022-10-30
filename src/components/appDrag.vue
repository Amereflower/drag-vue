<template>
  <div class="jianju">
    <el-collapse>
      <draggable id=item.module_eid group="my-group"  v-for="(item, index) in treeData"
          :key="index" @choose="filechoose(item,item.cou_parent_id)" @add="fileend(item,item.cou_parent_id)" handle=".icon-mulu1">
        <el-collapse-item

          :class="item.myclass"
        >


          <template #title>
            <div><span class="iconfont icon-mulu1"></span>{{ item.name }}</div>
          </template>

          <div style="text-align: left">

            <el-popover
              placement="right"
              width="200px"
              trigger="hover">
            <div>
            <el-button
              type="primary"
              size="small"
              @click="fileshow = true"
              plain
              >添加子目录</el-button
            >

            <el-button
              type="primary"
              size="small"
              @click="fromshow = true"
              plain
              >添加课程</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="delfile(item)"
              plain
              >删除此目录</el-button
            >
            </div>
              <i class="el-icon-edit" slot="reference"></i>
<!--              <el-button size="small" slot="reference" type="primary" icon="el-icon-edit" circle></el-button>-->
            </el-popover>


            <el-dialog title="新建目录" :visible.sync="fileshow">
              <el-form :model="form">
                <el-form-item label="名称" :label-width="formLabelWidth">
                  <el-input
                    v-model="newfile.name"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="模块期望学分"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model="newfile.expect_score"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="fileshow = false">取 消</el-button>
                <el-button type="primary" @click="addfile(item)"
                >确 定</el-button
                >
              </div>
            </el-dialog>
            <el-dialog title="编辑课程信息" :visible.sync="fromshow">
              <el-form :model="form">
                <el-form-item label="课程代码" :label-width="formLabelWidth">
                  <el-input v-model="form.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程名称" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                  label="课程英文名称"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model="form.englishName"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>

                <el-form-item label="学分" :label-width="formLabelWidth">
                  <el-input-number
                    v-model="form.credits"
                    :min="0.5"
                    :max="8"
                    label="学分"
                  ></el-input-number>
                </el-form-item>

                <el-form-item label="总学时" :label-width="formLabelWidth">
                  <el-input-number
                    v-model="form.total_hour"
                    :min="16"
                    :max="64"
                    :step="16"
                    label="学分"
                  ></el-input-number>
                </el-form-item>

                <el-form-item label="讲授" :label-width="formLabelWidth">
                  <el-input-number
                    v-model="form.teacher_hour"
                    :min="8"
                    :max="64"
                    :step="8"
                    label="学分"
                  ></el-input-number>
                </el-form-item>

                <el-form-item label="课程实践" :label-width="formLabelWidth">
                  <el-input-number
                    v-model="form.practice_hour"
                    :min="1"
                    :max="8"
                    label="学分"
                  ></el-input-number>
                </el-form-item>

                <el-form-item label="实验" :label-width="formLabelWidth">
                  <el-input-number
                    v-model="form.experiment_hour"
                    :min="1"
                    :max="8"
                    label="学分"
                  ></el-input-number>
                </el-form-item>

                <el-form-item label="课内上机" :label-width="formLabelWidth">
                  <el-input-number
                    v-model="form.in_class"
                    :min="1"
                    :max="8"
                    label="学分"
                  ></el-input-number>
                </el-form-item>

                <el-form-item label="课外上机" :label-width="formLabelWidth">
                  <el-input-number
                    v-model="form.out_class"
                    :min="1"
                    :max="8"
                    label="学分"
                  ></el-input-number>
                </el-form-item>

                <el-form-item label="开学学期" :label-width="formLabelWidth">
                  <el-select v-model="form.term" placeholder="请选择开课学期">
                    <el-option label="大一上" value="1"></el-option>
                    <el-option label="大一下" value="2"></el-option>
                    <el-option label="大二上" value="3"></el-option>
                    <el-option label="大二下" value="4"></el-option>
                    <el-option label="大三上" value="5"></el-option>
                    <el-option label="大三下" value="6"></el-option>
                    <el-option label="大四上" value="7"></el-option>
                    <el-option label="大四下" value="8"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="考查方式" :label-width="formLabelWidth">
                  <el-select v-model="form.exam" placeholder="请选择考查方式">
                    <el-option label="学校组织考试" value="X"></el-option>
                    <el-option label="学院组织考试" value="Y"></el-option>
                    <el-option label="考察" value="C"></el-option>
                    <el-option label="无" value=" "></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="起始周" :label-width="formLabelWidth">
                  <el-input v-model="form.start" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="备注" :label-width="formLabelWidth">
                  <el-input v-model="form.remark" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="fromshow = false">取 消</el-button>
                <el-button type="primary" @click="adddata(item, form)"
                  >确 定</el-button
                >
              </div>
            </el-dialog>

            <span class="census"
              >学时数<el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="cactime(item)"
                color="#068AC7"
                :format="counttime(item)"
              ></el-progress
            ></span>

            <span class="census"
              >学分数<el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="caccredit(item)"
                color="#068AC7"
                :format="countcredit(item)"
              ></el-progress
            ></span>
          </div>

          <div v-if="item.classTable.length>0" class="tablehead" style="margin-top: 8px">
            <!-- 这里是课程表头 -->
            <label class="Tmove Tcoursecode">
              <span>课程代码</span>
            </label>
            <el-divider direction="vertical" />
            <label class="Tcoursename"><span>课程名称</span> </label>
            <el-divider direction="vertical" />
            <label class="Tcourseenglishname"><span>课程英文名称</span> </label>
            <el-divider direction="vertical" />
            <label class="Tcredit">学分 </label>
            <el-divider direction="vertical" />
            <label class="Ttotalhours"><span>总学时</span> </label>
            <el-divider direction="vertical" />
            <label class="Tteachhours">讲授</label>
            <el-divider direction="vertical" />
            <label class="Tpratice">课程实践</label>
            <el-divider direction="vertical" />
            <label class="Texperiment">实验</label>
            <el-divider direction="vertical" />
            <label class="Tcinclass">课内上机</label>
            <el-divider direction="vertical" />
            <label class="Tcoutclass">课外上机</label>
            <el-divider direction="vertical" />
            <label class="Tsemester">开课学期</label>
            <el-divider direction="vertical" />
            <label class="Tassessment">考查方式</label>
            <el-divider direction="vertical" />
            <label class="Ttime"><span>起始周</span> </label>
            <el-divider direction="vertical" />
            <label class="Tremarks"><span>备注</span> </label>
            <el-divider direction="vertical" />
          </div>

          <draggable
            group="my-class"
            handle=".icon-shoudongzhuaqushuju"
            v-for="element in item.classTable"
              :key="element.id"
              @choose="whenchoose(element,item)"
            @add="whenend(item)"
          >
          <!-- 不知道为什么，但这里确实是add事件才能发生 -->
            <div
              class="tablehead"
            >
              <!-- 这里是课程信息 -->
              <div v-if="element.normal">
                <span class="iconfont icon-shoudongzhuaqushuju"></span>
                <label class="move coursecode">
                  <span>{{ element.code }}</span>
                </label>
                <el-divider direction="vertical" />
                <label class="coursename"
                  ><span>{{ element.name }}</span>
                </label>
                <el-divider direction="vertical" />
                <label class="courseenglishname"
                  ><span>{{ element.englishName }}</span>
                </label>

                <span>
                  <el-divider direction="vertical" />
                  <label class="credit">{{ element.credits }} </label>
                  <el-divider direction="vertical" />
                  <label class="totalhours"
                    ><span>{{ element.total_hour }}</span>
                  </label>
                  <el-divider direction="vertical" />
                  <label class="teachhours">{{ element.teacher_hour }}</label>
                  <el-divider direction="vertical" />
                  <label class="pratice">{{ element.practice_hour }}</label>
                  <el-divider direction="vertical" />
                  <label class="experiment">{{
                    element.experiment_hour
                  }}</label>
                  <el-divider direction="vertical" />
                  <label
                    class="cinclass"
                    :class="{ cinclasslabel: element.disabledMove }"
                    >{{ element.in_class }}</label
                  >
                  <el-divider direction="vertical" />
                  <label
                    class="coutclass"
                    :class="{ coutclasslabel: element.disabledMove }"
                    >{{ element.out_class }}</label
                  >
                  <el-divider direction="vertical" />
                  <label
                    class="semester"
                    :class="{ semesterlabel: element.disabledMove }"
                    >{{ element.term }}</label
                  >
                  <el-divider direction="vertical" />
                  <label
                    class="assessment"
                    :class="{ assessmentlabel: element.disabledMove }"
                    >{{ element.exam }}</label
                  >
                </span>
                <el-divider direction="vertical" />
                <label class="time"
                  ><span>{{ element.start }}</span>
                </label>
                <el-divider direction="vertical" />
                <label class="remarks"
                  ><span>{{ element.remark }}</span>
                </label>

                <el-divider direction="vertical" />
                <!-- @click="editmsg(element)" 在下方-->

                <el-button
                  style="margin-bottom: 8px"
                  type="primary"
                  size="small"
                  @click="editmsg(element)"
                  plain
                  >编辑</el-button
                >

                <el-dialog
                  title="编辑课程信息"
                  :visible.sync="element.editable"
                >
                  <el-form :model="form">
                    <el-form-item
                      label="课程代码"
                      :label-width="formLabelWidth"
                    >
                      <el-input
                        v-model="element.code"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="课程名称"
                      :label-width="formLabelWidth"
                    >
                      <el-input
                        v-model="element.name"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="课程英文名称"
                      :label-width="formLabelWidth"
                    >
                      <el-input
                        v-model="element.englishName"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="学分" :label-width="formLabelWidth">
                      <el-input-number
                        v-model="element.credits"
                        :min="0.5"
                        :max="8"
                        label="学分"
                      ></el-input-number>
                    </el-form-item>

                    <el-form-item label="总学时" :label-width="formLabelWidth">
                      <el-input-number
                        v-model="element.total_hour"
                        :min="16"
                        :max="64"
                        :step="16"
                        label="学分"
                      ></el-input-number>
                    </el-form-item>

                    <el-form-item label="讲授" :label-width="formLabelWidth">
                      <el-input-number
                        v-model="element.teacher_hour"
                        :min="8"
                        :max="64"
                        :step="8"
                        label="学分"
                      ></el-input-number>
                    </el-form-item>

                    <el-form-item
                      label="课程实践"
                      :label-width="formLabelWidth"
                    >
                      <el-input-number
                        v-model="element.practice_hour"
                        :min="1"
                        :max="8"
                        label="学分"
                      ></el-input-number>
                    </el-form-item>

                    <el-form-item label="实验" :label-width="formLabelWidth">
                      <el-input-number
                        v-model="element.experiment_hour"
                        :min="1"
                        :max="8"
                        label="学分"
                      ></el-input-number>
                    </el-form-item>

                    <el-form-item
                      label="课内上机"
                      :label-width="formLabelWidth"
                    >
                      <el-input-number
                        v-model="element.in_class"
                        :min="1"
                        :max="8"
                        label="学分"
                      ></el-input-number>
                    </el-form-item>

                    <el-form-item
                      label="课外上机"
                      :label-width="formLabelWidth"
                    >
                      <el-input-number
                        v-model="element.out_class"
                        :min="1"
                        :max="8"
                        label="学分"
                      ></el-input-number>
                    </el-form-item>

                    <el-form-item
                      label="开学学期"
                      :label-width="formLabelWidth"
                    >
                      <el-select
                        v-model="element.term"
                        placeholder="请选择开课学期"
                      >
                        <el-option label="大一上" value="1"></el-option>
                        <el-option label="大一下" value="2"></el-option>
                        <el-option label="大二上" value="3"></el-option>
                        <el-option label="大二下" value="4"></el-option>
                        <el-option label="大三上" value="5"></el-option>
                        <el-option label="大三下" value="6"></el-option>
                        <el-option label="大四上" value="7"></el-option>
                        <el-option label="大四下" value="8"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      label="考查方式"
                      :label-width="formLabelWidth"
                    >
                      <el-select
                        v-model="element.exam"
                        placeholder="请选择考查方式"
                      >
                        <el-option label="学校组织考试" value="X"></el-option>
                        <el-option label="学院组织考试" value="Y"></el-option>
                        <el-option label="考察" value="C"></el-option>
                        <el-option label="无" value=" "></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="起始周" :label-width="formLabelWidth">
                      <el-input
                        v-model="element.start"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="备注" :label-width="formLabelWidth">
                      <el-input
                        v-model="element.remark"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="savemsg(element)">取 消</el-button>
                    <el-button type="primary" @click="savemsg(element)"
                      >确 定</el-button
                    >
                  </div>
                </el-dialog>
                <!-- <el-divider direction="vertical" v-if="!element.editable" /> -->

                <el-divider direction="vertical" />

                <el-popover
                  placement="right"
                  title="警告"
                  width="200"
                  trigger="hover"
                  >
                  <p>删除后无法恢复数据，确认删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" >取消</el-button>
                    <el-button type="primary" size="mini" @click="delmsg(item, element)">确定</el-button>
                  </div>
                  <el-button
                    slot="reference"
                    type="danger"
                    size="small"

                    plain
                  >删除</el-button
                  >
                </el-popover>


              </div>
            </div>
          </draggable>

          <!-- 嵌套自身 -->
          <div class="children" v-if="item.childArr">
            <appDrag :treeData="item.childArr"></appDrag>
          </div>
          <!-- 嵌套自身 -->
        </el-collapse-item>
      </draggable>
    </el-collapse>
  </div>
</template>

<script>

import { ref } from "vue";
import draggable from "vuedraggable";

export default {
  name: "appDrag",
  props: ["treeData"],
  setup() {
    const activeNames = ref(["1"]);
    // const handleChange = (val) => {
    //     console.log(val)
    // }
    return {
      activeNames,
      // handleChange
    };
  },
  methods: {
    changeTreeData(nowTreeData) {
      this.$emit("update:modelValue", nowTreeData);
    },
    editmsg(element) {
      //点击修改按钮后更改相应值
      // console.log(element);
      element.editable = true;
    },
    savemsg(element) {
      element.editable = false;
    },
    delmsg(item, element) {
      //删除此课程
      console.log(item.classTable)
      item.classTable.map((val, i) => {
        if (val.course_eid === element.course_eid) {
          item.classTable.splice(i, 1);
          console.log('删除成功！')
        }
      });
      //拖拽后实际上treedata没有更新，但是可以获取到在页面上的位置从而与后端发请求，再数据结构做改变

      // item.find(item => item.course_eid==element.course_eid);

      // console.log(element.course_eid);
      // console.log(item.expect_score)
      console.log(this.treeData)
    },
    findcourse(id) {
      return id;
    },
    countcredit(item) {
      return () => {
        return item.childcredits;
      };
    },
    caccredit(item) {


      // let max = item.expect_score;
      let max = 200;
      return Math.round((item.childcredits* 100) / max);
    },
    cactime(item) {

      let max = 4000; //每个模块也有一个最大学时数，也需要设置或返回。目录出设置
      return Math.round((item.childtime * 100) / max);
    },
    counttime(item) {
      return () => {
        return item.childtime
      };
    },
    adddata(item, form) {
      //既要item也要from，
      item.classTable.push({
        editable: false,
        normal: true,
        module_eid: 17,
        name: form.name,
        mod_parent_id: 3,
        expect_score: null,
        course_eid: 98,
        code: form.code,
        englishName: form.englishName,
        credits: form.credits,
        total_hour: form.total_hour,
        teacher_hour: form.teacher_hour,
        practice_hour: form.practice_hour,
        experiment_hour: form.experiment_hour,
        in_class: form.in_class,
        out_class: form.out_class,
        term: form.term,
        exam: form.exam,
        start: form.start,
        remark: form.remark,
        cou_expect_score: null,
        on_group: null,
        cou_parent_id: 13,
      });
      item.childcredits+=form.credits;
      item.childtime+=form.total_hour;
      // this.transgerData()  //将新添加的课程分数向上传递
      this.fromshow = false;
      this.form = [];
    },
    addfile(item) {
      console.log(item);
      console.log("AAAAAAAAAAAAAA");
      item.childArr.push({
        module_eid: 255,
        name: this.newfile.name,
        expect_score: this.newfile.expect_score,
        classTable: [],
        childArr: [],
        mod_parent_id:item.module_eid
      });
      this.newfile = [];
      this.fileshow = false;
      // 添加子目录、目录的各个属性，用弹出框提示用户输入
    },
    start() {
      console.log("i ma start drag right now!!!");
    },
    startt() {
      console.log("AAAAAAAAAAAAAAAAA");
    },
    whenchoose(element,item) {
      console.log(element.module_eid+" 从目录 [" + item.module_eid+"] 被拿走了 ");
      // console.log(item.classTable)  并没有被改变，但是拖动后再次拖动会改变，为什么
    },
    whenend(item) {

        console.log("新目录是"+item.module_eid)
    },
    filechoose(item,id) {
        console.log("从"+id);
    },
    fileend(item,id) {
        // console.log(item.log)
        // console.log("after id is"+id)
        console.log("移动到"+id)
    },
    delfile(item) {
      console.log(item);
    }
  },
  data() {
    return {
      form: {
        code: "",
        name: "",
        englishName: "",
        credits: "",
        total_hour: "",
        teacher_hour: "",
        practice_hour: "",
        experiment_hour: null,
        in_class: null,
        out_class: null,
        term: "",
        exam: "",
        start: "",
        remark: null,
      },
      fileshow: false,
      fromshow: false,
      formLabelWidth: "120px",
      newfile: {
        name: "",
        expect_score: "",
        module_eid: 9, //后端返回
        childArr: [],
        myclass: "", //询问用户还是同级设置
        classTable: [],
      },
    };
  },
  components: {
    draggable,
  },
};
</script>
<style scoped>
.tablehead {
  border: solid 1px #ddd;
  padding: 0px;
  text-align: left;
  background-color: #fff;
  margin-bottom: 10px;
  display: flex;
  height: 41px;
  user-select: none;
}

.flex-grow {
  flex-grow: 1;
}

.el-menu {
  background-color: #f1f1f1;
}

body {
  padding: 0px;
  margin: 0px;
  background-color: #f1f1f1;
}

.msg {
  padding: 10px 20px 0px 20px;
}

.itxst {
  background-color: #f1f1f1;
  display: flex;
  padding: 20px;
}

.group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  width: auto;
  height: auto;
  margin-right: 20px;
}

.item {
  border: solid 1px #ddd;
  padding: 0px;
  text-align: left;
  background-color: #fff;
  margin-bottom: 10px;
  display: flex;
  height: 41px;
  user-select: none;
}

.item > label {
  color: #333;
}

.item > label:hover {
  cursor: move;
}

.item > span {
  color: #666;
}

.ghost {
  border: solid 1px rgb(19, 41, 239) !important;
}

.chosenClass {
  opacity: 1;
  border: solid 1px red;
}

.fallbackClass {
  background-color: aquamarine;
}

.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}



.coursename {
  padding-top: 8px;
  width: 108px;
  text-align: left;
  display: inline-block;
  text-overflow: ellipsis; /*让截断的文字显示为点点。还有一个值是clip意截断不显示点点*/
  white-space: nowrap; /*让文字不换行*/
  overflow: hidden; /*超出要隐藏*/
}

.courseenglishname {
  padding-top: 8px;
  width: 153px;
  text-align: left;
  display: inline-block;
  text-overflow: ellipsis; /*让截断的文字显示为点点。还有一个值是clip意截断不显示点点*/
  white-space: nowrap; /*让文字不换行*/
  overflow: hidden; /*超出要隐藏*/
}

.coursecode,
.credit,
.teachhours,
.pratice,
.experiment,
.coutclass,
.semester,
.assessment {
  padding-top: 8px;
  width: 26px;
  text-align: center;
  display: inline-block;
}
.cinclass {
  width: 25px;
  display: inline-block;
}

.totalhours {
  padding-top: 8px;
  width: 26px;
  text-align: center;
  display: inline-block;
}

.time {
  padding-top: 8px;
  width: 60px;
  text-align: center;
  display: inline-block;
}

.remarks {
  padding-top: 8px;
  width: 50px;
  text-align: center;
  display: inline-block;
}

.totalhourslabel,
.praticelabel,
.cinclasslabel,
.coutclasslabel,
.semesterlabel,
.assessmentlabel {
  padding: 0px !important;
}

label.move {
  width: 90px;
}

.longremarks {
  text-align: left;
  display: inline-block;
  margin-left: 10px;
  margin-top: 8px;
}

.mkson {
  margin-left: 20px;
  font-size: 1px;
  height: 22px;
  width: 88px;
}

.mkbro {
  margin-left: 20px;
  font-size: 1px;
  height: 22px;
  width: 99px;
}

.openedit {
  margin: 8px 140px 0px 140px;
}

.el-input__inner {
  border: none;
  font-size: small;
}

.el-select {
  width: 150px;
  text-align: center;
}

.el-input__inner {
}

.el-divider--vertical {
  height: 41px;
  margin-bottom: 15px;
}

/*以下是表头的格式 */
.Tcoursecode,
.Tcoursename,
.Tcourseenglishname,
.Tcredit,
.Ttotalhours,
.Tteachhours,
.Tpratice,
.Texperiment,
.Tcinclass,
.Tcoutclass,
.Tsemester,
.Tassessment,
.Ttime,
.Tremarks {
  text-align: center;
  width:57px;
}
.Tcoursename {
  width: 115px;
}
.Tcourseenglishname {
  width: 160px;
}
.Tcredit,
.Ttotalhours,
.Tteachhours,
.Tpratice,
.Texperiment,
.Tcinclass,
.Tcoutclass,
.Tsemester,
.Tassessment {
  width: 33px;
}
.Ttime {
  width: 68px;
}
label.Tmove {
  width: 123px;
}
.el-progress {
  width: 50%;
  margin-left: 8px;
}
.census {
  display: flex;
  margin: 8px;
}
.el-form-item {
  margin-bottom: 8px;
}

.icon-shoudongzhuaqushuju {
  margin-left: 4px;
  border: solid;
  border-width: 1px;
  padding: 2px;
}
.icon-shoudongzhuaqushuju:hover {
  background-color: grey;
  cursor: move;
}
.icon-mulu1 {
  margin: 4px;
  border: solid;
  border-width: 1px;
  padding: 2px;
}
.icon-mulu1:hover {
  background-color: grey;
  cursor: move;
}
/* .icon-shoudongzhuaqushuju::selection{
  background-color:green;
  cursor:move;
} */
.jianju {
  margin-left:30px
}
/* 用嵌套递归去规定 */
</style>
