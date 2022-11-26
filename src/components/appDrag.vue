<template>
  <div class="jianju">
    <el-collapse>
      <div v-for="(item, index) in treeData">
        <draggable id=item.module_eid group="my-group"
                   :key="index" @choose="filechoose(item,item.mod_parent_id)" @add="fileend(item,item.mod_parent_id)"
                   handle=".icon-mulu1">
          <el-collapse-item>


            <template #title>
              <div><span class="iconfont icon-mulu1"></span>{{ item.name }}</div>
            </template>
            <div style="text-align: left">

              <el-popover
                placement="bottom"
                width="200px"
                trigger="hover">
                <div>
                  <el-button
                    type="primary"
                    size="small"
                    @click="addFilePost(item)"
                    plain
                  >添加子目录
                  </el-button
                  >

                  <el-button
                    type="primary"
                    size="small"
                    @click="ifitem(item)"
                    plain
                  >添加课程
                  </el-button
                  >
                  <el-button
                    type="danger"
                    size="small"
                    @click="delfile(item)"
                    plain
                  >删除此目录
                  </el-button
                  >
                </div>
                <el-button icon="el-icon-edit" slot="reference" size="small">编辑</el-button>
              </el-popover>


              <el-dialog title="新建目录" :visible="fileshow" append-to-body>
                <el-form :model="newfile">
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
                  <el-button type="primary" @click="addfile()"
                  >确 定
                  </el-button
                  >
                </div>
              </el-dialog>

              <el-dialog title="新建课程信息" :visible.sync="fromshow" append-to-body>
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
                  <el-button type="primary" @click="adddata(form)"
                  >确 定
                  </el-button
                  >
                </div>
              </el-dialog>

              <el-popover
                placement="top"
                width="150"
                trigger="hover">
                <div class="static-credits"
                >学时数
                  <span class="static-num">{{ counttime(item) }}</span>
                </div>

                <div class="static-credits"
                >学分数
                  <span class="static-num">{{ countcredit(item) }}</span>
                </div>

                <div class="static-credits"
                >理论学时数
                  <span class="static-num">{{ countteach(item) }}</span>
                </div>

                <div class="static-credits"
                >实践学时数
                  <span class="static-num">{{countexper(item) }}</span>
                </div>
                <el-button icon="el-icon-s-data" slot="reference" size="small">统计</el-button>
              </el-popover>
              <span style="margin-left: 8px;margin-right: 8px">模块标签>></span>
              <el-tag
                :key="tag"
                v-for="tag in item.tag"
                closable
                type="info"
                :disable-transitions="false"
                @close="delModuleTag(item,tag)"
              >{{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="item.inputVisible"
                v-model="item.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="Mconfirm(item)"
                @blur="Mconfirm(item)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showMinput(item)">+ New Tag</el-button>


            </div>

            <div v-if="item.classTable.length>0" class="tablehead" style="margin-top: 8px">
              <!-- 这里是课程表头 -->
              <label class="Tmove Tcoursecode">
                <span>课程代码</span>
              </label>
              <el-divider direction="vertical"/>
              <label class="Tcoursename"><span>课程名称</span> </label>
              <el-divider direction="vertical"/>
              <label class="Tcourseenglishname"><span>课程英文名称</span> </label>
              <el-divider direction="vertical"/>
              <label class="Tcredit">学分 </label>
              <el-divider direction="vertical"/>
              <label class="Ttotalhours"><span>总学时</span> </label>
              <el-divider direction="vertical"/>
              <label class="Tteachhours">讲授</label>
              <el-divider direction="vertical"/>
              <label class="Tpratice">课程实践</label>
              <el-divider direction="vertical"/>
              <label class="Texperiment">实验</label>
              <el-divider direction="vertical"/>
              <label class="Tcinclass">课内上机</label>
              <el-divider direction="vertical"/>
              <label class="Tcoutclass">课外上机</label>
              <el-divider direction="vertical"/>
              <label class="Tsemester">开课学期</label>
              <el-divider direction="vertical"/>
              <label class="Tassessment">考查方式</label>
              <el-divider direction="vertical"/>
              <label class="Ttime"><span>起始周</span> </label>
              <el-divider direction="vertical"/>
              <label class="Tremarks"><span>备注</span> </label>
              <el-divider direction="vertical"/>
              <label class="Ttag"><span>标签</span> </label>
              <el-divider direction="vertical"/>
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
                  <el-divider direction="vertical"/>
                  <el-tooltip effect="light" placement="bottom">
                    <div slot="content">{{ element.name }}</div>
                    <label class="coursename"
                    ><span>{{ element.name }}</span>
                    </label>
                  </el-tooltip>
                  <el-divider direction="vertical"/>
                  <el-tooltip effect="light" placement="bottom">
                    <div slot="content">{{ element.englishName }}</div>
                    <label class="courseenglishname"
                    ><span>{{ element.englishName }}</span>
                    </label>
                  </el-tooltip>

                  <span>
                  <el-divider direction="vertical"/>
                  <label class="credit">{{ element.credits }} </label>
                  <el-divider direction="vertical"/>
                  <label class="totalhours"
                  ><span>{{ element.total_hour }}</span>
                  </label>
                  <el-divider direction="vertical"/>
                  <label class="teachhours">{{ element.teacher_hour }}</label>
                  <el-divider direction="vertical"/>
                  <label class="pratice">{{ element.practice_hour }}</label>
                  <el-divider direction="vertical"/>
                  <label class="experiment">{{
                      element.experiment_hour
                    }}</label>
                  <el-divider direction="vertical"/>
                  <label
                    class="cinclass"
                    :class="{ cinclasslabel: element.disabledMove }"
                  >{{ element.in_class }}</label
                  >
                  <el-divider direction="vertical"/>
                  <label
                    class="coutclass"
                    :class="{ coutclasslabel: element.disabledMove }"
                  >{{ element.out_class }}</label
                  >
                  <el-divider direction="vertical"/>
                  <label
                    class="semester"
                    :class="{ semesterlabel: element.disabledMove }"
                  >{{ element.term }}</label
                  >
                  <el-divider direction="vertical"/>
                  <label
                    class="assessment"
                    :class="{ assessmentlabel: element.disabledMove }"
                  >{{ element.exam }}</label
                  >
                </span>
                  <el-divider direction="vertical"/>
                  <label class="time"
                  ><span>{{ element.start }}</span>
                  </label>
                  <el-divider direction="vertical"/>
                  <label class="remarks"
                  ><span>{{ element.remark }}</span>
                  </label>
                  <el-divider direction="vertical"/>
                  <el-select
                    size="mini"
                    v-model="element.tag"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择课程标签">
                    <el-option
                      v-for="item in allTags"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>

                  <el-divider direction="vertical"/>
                  <!-- @click="editmsg(element)" 在下方-->

                  <el-button
                    style="margin-bottom: 8px"
                    type="primary"
                    size="small"
                    @click="editmsg(element)"
                    plain
                  >编辑
                  </el-button
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
                      >确 定
                      </el-button
                      >
                    </div>
                  </el-dialog>
                  <!-- <el-divider direction="vertical" v-if="!element.editable" /> -->

                  <el-divider direction="vertical"/>


                  <el-popconfirm
                    title="删除后无法恢复数据，确认删除吗？"
                    @confirm="delmsg(item,element)"
                    @cancel="notdelmsg(element)"
                  >
                    <el-button
                      slot="reference"
                      type="danger"
                      size="small"
                      plain
                    >删除
                    </el-button
                    >
                  </el-popconfirm>


                </div>
              </div>
            </draggable>

            <!-- 嵌套自身 -->
            <div class="children" v-if="item.childArr">
              <appDrag :treeData="item.childArr" :drop="drop"></appDrag>
            </div>
            <!-- 嵌套自身 -->
          </el-collapse-item>
        </draggable>
      </div>
    </el-collapse>
  </div>

</template>

<script>

import {ref} from "vue";
import draggable from "vuedraggable";

export default {
  name: "appDrag",
  // model:{
  //     prop:"treeData",
  //     event:"change"
  // },
  props: {
    // 这将允许 `value` 属性用于其他用途
    value: [],
    // 使用 `title` 代替 `value` 作为 model 的 prop
    treeData: {
      type: [],
      default: []
    },
    drop: {
      type: {},
      default: {}
    }
  },
  mounted() {
  },
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
    delModuleTag(item,t) {
      item.tag.splice(item.tag.indexOf(t), 1);
    },
    showMinput(item){
      item.inputVisible=true;
      this.$forceUpdate()
      // this.$nextTick(() => {
      //   this.$refs.saveTagInput.$refs.input.focus();
      // });
    },
    Mconfirm(item){
      let inputValue = item.inputValue;
      if (inputValue) {
        item.tag.push(inputValue);
      }
      item.inputVisible = false;
      item.inputValue = '';
    },
    showInput(e) {
      e.inputVisible = true;
      // this.$nextTick(_ => {
      //   this.$refs.saveTagInput.$refs.input.focus();
      // });
    },
    handleInputConfirm(e) {
      let inputValue = e.inputValue;
      if (inputValue) {
        e.tag.push(inputValue);
      }
      e.inputVisible = false;
      e.inputValue = '';
    },
    handleClose(tag, dynamicTags) {
      dynamicTags.splice(dynamicTags.indexOf(tag), 1);
      //同步修改，传进来后修改相当于对elemet.tag做了修改
    },
    ifitem(item) {
      //添加课程的表单，提交
      console.log(item)
      console.log("以上就是那样的花朵")
      this.addCourseParentId = item;
      this.fromshow = true
      this.$forceUpdate()
    },
    editmsg(element) {
      //点击修改按钮后更改相应值
      // console.log(element);
      element.editable = true;
      this.$forceUpdate()
    },
    savemsg(element) {
      element.editable = false;
      this.$forceUpdate()
    },
    notdelmsg(element) {
      element.delview = false;
    },
    delmsg(item, element) {
      //删除此课程

      console.log(item.classTable)
      for (let index = 0; index < item.classTable.length; index++) {
        if (item.classTable[index].code === element.code) {
          item.classTable.splice(index, 1);
          this.$forceUpdate();
          return;
        }
      }

      //拖拽后实际上treedata没有更新，但是可以获取到在页面上的位置从而与后端发请求，再数据结构做改变

      // item.find(item => item.course_eid==element.course_eid);
      // console.log(element.course_eid);
      // console.log(item.expect_score)
      // console.log(this.treeData)
    },

    countcredit(item) {
      return item.childcredits;
    },
    counttime(item) {
      return item.childtime
    },
    countteach(item) {
      return item.childteach
    },
    countexper(item) {
      return item.childexper
    },

    adddata(form) {
      //既要item也要from，
      const item = this.addCourseParentId
      console.log("item is")
      console.log(item)
      console.log(form)
      console.log("over")
      this.$axios.post
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
      item.childcredits += form.credits;
      item.childtime += form.total_hour;
      // this.transgerData()  //将新添加的课程分数向上传递
      this.fromshow = false;
      this.$forceUpdate();
      // this.form = [];
    },
    addFilePost(item) {
      this.addFileItem = item;
      this.fileshow = true;

    },
    addfile() {
      const item = this.addFileItem;
      item.childArr.push({
        module_eid: 255,
        name: this.newfile.name,
        expect_score: this.newfile.expect_score,
        classTable: [],
        childArr: [],
        childcredits: 0,
        childtime: 0,
        mod_parent_id: item.module_eid
      });

      // this.newfile = [];
      this.fileshow = false;
      this.$forceUpdate()
      //奇迹
      return
      // 添加子目录、目录的各个属性，用弹出框提示用户输入
    },
    start() {
      console.log("i ma start drag right now!!!");
    },
    whenchoose(element, item) {
      console.log(element)
      console.log(element.code + " 从目录 [" + item.module_eid + "] 被拿走了 ");

      this.drop.dropcourse.course_eid = element.course_eid

      // console.log(item.classTable)  并没有被改变，但是拖动后再次拖动会改变，为什么
    },
    whenend(item) {
      this.drop.dropcourse.cou_parent_id = item.module_eid;
      const courseparam = {
        courses_eid: this.drop.dropcourse.course_eid.toString(),
        cou_parent_id: this.drop.dropcourse.cou_parent_id.toString()
      }
      //发送课程修改请求
      this.$axios.post("http://trainingplan.rzcloud.online/dropcourse", (courseparam))
        .then(res => {
          console.log(res.data.data)
        })
        .catch(error => {
          console.log(error)
        })
      // console.log("的新目录是"+item.module_eid)
    },
    filechoose(item, id) {
      console.log(item.module_eid + "从" + id);
      // this.treeData.dropmodule.module_eid=item.module_eid
      this.drop.dropmodule.module_eid = item.module_eid
      console.log(this.drop)
      this.$forceUpdate()

      return
    },

    fileend(item, id) {

      // console.log(item.log)
      // console.log("after id is"+id)
      // this.treeData.dropmodule.mod_parent_id=id;
      this.drop.dropmodule.mod_parent_id = id;

      const dropparams = {
        module_eid: this.drop.dropmodule.module_eid.toString(),
        mod_parent_id: this.drop.dropmodule.mod_parent_id.toString()
      }

      console.log(this.dropmodule)

      //应该是异步的问题。
      this.$axios.post("http://trainingplan.rzcloud.online/dropmodule", (dropparams))
        .then(res => {
          console.log(res.data.data)
        })
        .catch(error => {
          console.log(error)
        })
      console.log("移动到" + id)

      console.log(this.drop)
    },
    delfile(item) {
      console.log(item);
    }
  },
  data() {
    return {
      addCourseParentId: null,
      addFileItem: null,
      dropcourse: {
        course_eid: 0,
        cou_parent_id: 0
      },
      dropmodule: {
        module_eid: 0,
        mod_parent_id: 0
      },
      MODULE_EID: 0,
      MOD_PAR_ID: 0,
      allTags: [{
        value: 'a',
        label: 'a'
      },
        {
          value: 'b',
          label: 'b'
        },
        {
          value: 'c',
          label: 'c'
        },
        {
          value: 'd',
          label: 'd'
        },
        {
          value: 'e',
          label: 'e'
        }],
      thisismsg: '121',
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
      fromshow: false,
      fileshow: false,
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
  width: 73px;
  text-align: left;
  display: inline-block;
  text-overflow: ellipsis; /*让截断的文字显示为点点。还有一个值是clip意截断不显示点点*/
  white-space: nowrap; /*让文字不换行*/
  overflow: hidden; /*超出要隐藏*/
}

.courseenglishname {
  padding-top: 8px;
  width: 103px;
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
  /*width: 150px;*/
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
  width: 57px;
}

.Tcoursename {
  width: 80px;
}

.Tcourseenglishname {
  width: 110px;
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

.Ttag {
  width: 209px;
}

label.Tmove {
  width: 123px;
}

.el-progress {
  width: 50%;
  margin-left: 8px;
}

.static-credits {
  display: flex;
  margin: 8px;
}

.static-num {
  color: #5CB87A;
  margin-left: 8px;
}

.static-b-num {
  color: #409EFF;
  margin-left: 8px;
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
  margin-left: 20px
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.el-input--mini {
  height: 28px
}

/* 用嵌套递归去规定 */
</style>
