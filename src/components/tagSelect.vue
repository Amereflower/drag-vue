<template>
  <div class="hover-div">
    <div class="hover-div-tag-select" v-drag:[firstPosition]
         :style="{backgroundColor:'#a5a5a5',padding:'10px',width:tagDivWidth,borderRadius:'25px',height:tagDivHeight}">
      <div :style="{height:selectedTagHeight}">
        <el-tag
          style="margin: 5px "
          :key="tag"
          v-for="tag in chosenTagArr"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
      </div>
      <el-autocomplete
        style="margin-top:10px"
        class="inline-input"
        v-model="strValue"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @select="handleSelect"
      ></el-autocomplete>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tagSelect',
  props: ['module_Tag', 'tagFlag', 'tagArr', 'firstPosition', "type"],
  setup() {
    return {}
  },
  directives: {
    drag: {
      inserted: function (el, binding) {
        el.style.position = 'absolute'
        el.style.left = binding.arg.left + 'px'
        el.style.top = binding.arg.top + 'px'
        el.onmousedown = function (e) {
          var x = e.clientX - el.offsetLeft
          var y = e.clientY - el.offsetTop
          document.onmousemove = function (eve) {
            el.style.left = eve.clientX - x + 'px'
            el.style.top = eve.clientY - y + 'px'
          }
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  methods: {
    handleSelect(item) {
      this.strValue = ''
      // 如果item.value不在chosenTagArr中，就添加
      if (this.chosenTagArr.indexOf(item.value) === -1) {
        this.chosenTagArr.push(item.value)
        this.tagFlag = true
        if (this.chosenTagArr.length > 6) {
          this.tagDivHeight = '185px'
          this.selectedTagHeight = '130px'
        } else if (this.chosenTagArr.length > 3) {
          this.tagDivHeight = '140px'
          this.selectedTagHeight = '80px'
        } else {
          this.tagDivHeight = '110px'
          this.selectedTagHeight = '50px'
        }
        // TODO: 根据筛选module_Tag
        console.log(this.module_Tag)
        let tempFlag = true
        if (this.type === 'model') {
          for (let i = 0; i < this.module_Tag.length; i++) {
            for (let k = 0; k < this.chosenTagArr.length; k++) {
              // 判断module_Tag中的tag是否包含chosenTagArr中的tag
              if (this.module_Tag[i].tag.indexOf(this.chosenTagArr[k]) === -1) {
                tempFlag = false
                break // 如果不包含，就跳出循环
              }
            }
            if (!tempFlag) {
              // 删除不符合条件的module
              this.module_Tag.splice(i, 1)
              console.log(this.module_Tag[i], "在model筛选中被删除")
            }
          }
        } else if (this.type === 'class') {
          for (let i = 0; i < this.module_Tag.length; i++) {
            for (let j = 0; j < this.module_Tag[i].class.length; j++) {
              for (let k = 0; k < this.chosenTagArr.length; k++) {
                // 判断module_Tag中的tag是否包含chosenTagArr中的tag
                if (this.module_Tag[i].class[j].tag.indexOf(this.chosenTagArr[k]) === -1) {
                  tempFlag = false
                  break // 如果不包含，就跳出循环
                }
              }
              if (!tempFlag) {
                // 删除不符合条件的class
                this.module_Tag[i].class.splice(j, 1)
                console.log(this.module_Tag[i].class,"在class筛选中被删除")
              }
            }
          }
        }
        console.log("最后剩下了", this.module_Tag)
        this.$parent.totree()
      } else {
        this.$message({
          message: '已存在 "' + item.value + '" 的Tag！',
          type: 'warning'
        })
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleClose(tag) {
      this.chosenTagArr.splice(this.chosenTagArr.indexOf(tag), 1)
      if (this.chosenTagArr.length === 0) {
        this.tagFlag = false
      }
    },
    loadAll() {
      var tempStructArr = [] // TODO
      for (var i = 0; i < this.tagArr.length; i++) {
        // 添加元素
        tempStructArr.push({
          'value': this.tagArr[i],
          'address': this.tagArr[i]
        })
      }
      return tempStructArr
    }
  },
  data() {
    return {
      tagDivWidth: '300px',
      tagDivHeight: '110px',
      selectedTagHeight: '50px',
      chosenTagArr: [],
      strValue: ''
    }
  }
}
</script>
<style>
.hover-div {
  width: 20%;
  height: 26%;
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

.hover-div-tag-select {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

}
</style>
