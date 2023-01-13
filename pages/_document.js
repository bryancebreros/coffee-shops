import Document, {Html, Head, Body, Main, NextScript} from "next/document"
class MyDocument extends Document{
    render() {
        return (
            <Html lang='en'>
                <Head>
                    <link
                        rel="preload"
                        href="/fonts/IBMPlexSans-Bold.ttf"
                        as="font"
                        crossOrigin="anonymous"
                    ></link>
                    <link
                        rel="preload"
                        href="/fonts/IBMPlexSans-Regular.ttf"
                        as="font"
                        crossOrigin="anonymous"
                    ></link>
                    <link
                        rel="preload"
                        href="/fonts/IBMPlexSans-SemiBold.ttf"
                        as="font"
                        crossOrigin="anonymous"
                    ></link>
                </Head>
                <Body>
                    <Main></Main>
                    <NextScript />
                </Body>
            </Html>
            )
    }
    
}

export default Document