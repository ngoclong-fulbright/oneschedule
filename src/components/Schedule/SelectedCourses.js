import { TwitterPicker } from "react-color"
import {COLORS} from '../../data/'
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { setColor, toggleSelection, toggleVisibility } from "../../store/selectedCoursesSlice"
import { courseExist, getCourseInfo } from "../../utils/course"
import { useClickOutside } from "../../hooks"


const ColorPicker = ({courseId}) => {
  const [isOpen, setIsOpen] = useState(false)
  const color = useSelector(state => state.selectedCourses.value
    .filter(course => course.id === courseId)[0].color)
  const dispatch = useDispatch()

  const changeColor = (color) => {
    dispatch(setColor({id: courseId, color: color.hex}))   
    setIsOpen(false)
  }

  const domNode = useClickOutside(() => {
    setIsOpen(false);
  });
    
  return (
    <div ref={domNode} className='modifier me-2'>
      <div className='color-btn modifier rounded'
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        style={({backgroundColor: color})}
      >
      </div>
      <div className='color-picker position-relative'>
        {isOpen 
        ? 
          <TwitterPicker
            colors={COLORS.sort()}
            onChangeComplete={changeColor}
            width="204px"
          />
        : <div></div>
        }
      </div>
    </div>
  )
}

const CreditCount = ({selectedCourses}) =>{
  const credits = selectedCourses.reduce((preValue, curValue) => (
      preValue + 
        (curValue.visible ? parseInt(getCourseInfo(curValue.id).credits) : 0)
    ), 0
  )

  return (
    <div className="mt-3 o-large o-dark-primary">
      Current credits: <span className="o-larger">{credits}</span>
    </div>
  )
}

const SelectedCourses = ({selectedCourses}) => {
  const dispatch = useDispatch()

  return (
  <div className="selected-courses d-flex flex-column">
    {
      selectedCourses
      .filter(course => courseExist(course.id))
      .map(course => {
        const info = getCourseInfo(course.id)
        return {...course, title: info.title, instructor: info.instructor}
      })
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((course) => (
        <div className="selected-course d-flex flex-row justify-content-between align-items-start" key={course.id}> 
          <div className="selected-info flex-grow-1 d-flex flex-column">
            <Link className="heading-2 text-decoration-none"
              to={`/courses/${course.id}`}
            >
              {course.title}
            </Link>
            <div className='d-flex flex-row align-items-center mt-2'>
              <ColorPicker courseId={course.id}/>
              <div className='d-flex flex-column'>
                <div className="selected-instructor"> {course.id} | {course.instructor} </div>
              </div>
            </div>
          </div>
          <div className="toggle-btns d-flex flex-column">
            <div 
              className="modifier eye"
              onClick={() => dispatch(toggleVisibility({id: course.id}))}
            >
              {course.visible ? 
              <i className="fas fa-eye o-dark-primary"></i> : <i className="fas fa-eye-slash o-dark-primary"></i>}
            </div>
            <div 
              className="modifier trash"
              onClick={() => dispatch(toggleSelection({id: course.id}))}
            >
              <i className="fas fa-trash o-dark-primary"></i>
            </div>
          </div>
        </div>
      ))   
    }    
  </div>
  )
}

export {SelectedCourses, CreditCount}