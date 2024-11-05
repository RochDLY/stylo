import React, { forwardRef } from 'react'
import styles from './button.module.scss'
import fieldStyles from './field.module.scss'
import { clsx } from 'clsx'

const Select = forwardRef((props, forwardedRef) => {
  const alignLabel = props.alignLabel !== false
  return (<div className={clsx(fieldStyles.field, 'control-field')} ref={forwardedRef}>
    {props.label && <label htmlFor={props.id} style={
      alignLabel ? {
        flexBasis: "10rem",
        textAlign: "end"
      } : {}
    }>{props.label}</label>}
    <div className={styles.selectContainer}>
      <select className={props.className || styles.select} {...props}>{props.children}</select>
    </div>
  </div>)
})

Select.displayName = 'Select'

export default Select
