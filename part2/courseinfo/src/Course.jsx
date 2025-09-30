const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  )
}

const Content = ({ course }) => {
  return (
    <>
      {course.parts.map((part) => <Part key={part.id} part={part} />)}
    </>
  )
}

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Total = ({ course }) => {
  return (
    <p>Number of exercises {course.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>
  )
}

export default Course