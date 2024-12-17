import Head from "next/head";
import React from "react";

function PageHead({title,metaDes}) {
  // const { title } = props;
//   const { favicon } = settings();
  // const { metaDes } = props;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={metaDes} />
      
    </Head>
  );
}

export default PageHead;
