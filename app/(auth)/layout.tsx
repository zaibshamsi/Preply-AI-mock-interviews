import React, {ReactNode} from 'react'
import layout from "@/app/(root)/layout";

const AuthLayout = ({children} : { children:ReactNode}) => {
    return (
        <div className="auth-layout">{children}</div>
    )
}
export default AuthLayout
