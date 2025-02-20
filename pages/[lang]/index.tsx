
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Window from '@/frontend/components/qecomps/Window';
import { useEffect } from 'react';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router from 'next/router'
import Copy from '@/frontend/components/qecomps/Copy';
import FaDigits, { EnDigits } from '@/frontend/components/qecomps/FaDigits';
import TextBox from '@/frontend/components/qecomps/TextBox';

export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onConnected, dies, z) => {

  onConnected(async () => {
    await nexus.subscribe("myroom")
    nexus.msgreceiver = (specs) => {
      if (!props.messages) {
        props.messages = []
      }

      props.messages.push(specs)
      refresh()

      setTimeout(()=>{
        let el = document.getElementById("content");
        el.scrollTop = el.scrollHeight
      }, 200)
    }
  })

  return <div style={{ direction: z.lang.dir, padding: 10 }}>
    <div id="content" style={{ minHeight: 500, maxHeight: 500, backgroundColor: "#A5BCA6", borderRadius: 5, padding:10, overflowY:"scroll" }}>
      {(props.messages || []).map(message => {
        return <>
          <f-12>{message.body}</f-12>
          <br-x />
        </>
      })}
    </div>

    <TextBox title='لطفا پیام خود را وارد کنید' on={(txt) => { props.message = txt }}
      onenter={async () => {
        await nexus.sendtochannel("myroom", props.message)
        props.message = ""
        refresh()
      }} />
    <br-x />
    <b-200 style={{ backgroundColor: "#748EC5" }} onClick={async () => {

      await nexus.sendtochannel("myroom", props.message)
      props.message = ""
      refresh()
    }}>
      <f-12>Send</f-12>
    </b-200>

  </div>
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  (global.Startup != "OK") ? (await (await import('@/startup.ts')).Starter()) : null

  var session = await global.SSRVerify(context)
  var { uid, name, image, imageprop, lang, cchar,
    unit, workspace, servid, servsecret,
    usedquota, quota, quotaunit, status, regdate, expid,
    role, path, devmod, userip, pageid } = session;


  let keys = ["region", "dir", "ff", "ffb", "support", "code", "textw", "txtmt"]
  let nlangs = {}
  for (let l of Object.keys(global.langs[lang])) {
    if (keys.includes(l))
      nlangs[l] = global.langs[lang][l]
  }

  let obj = await Prosper({
    props: {
      value: { v: "hiiii" },
      query: context.query,
      nlangs,
      path,
      session,
      title: "test title",
      description: "test description",
      pageid,
    },
  }, context)


  return obj

}


