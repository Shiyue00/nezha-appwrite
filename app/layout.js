export const metadata = {
    title: 'Nezha Agent',
    description: 'Nezha monitoring agent runner',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ margin: 0, padding: 0 }}>{children}</body>
        </html>
    )
}
