import React from 'react';
import Layout from '../components/layout/layout';
import SEO from '../components/layout/seo';
import { Calendar } from '../components/calendar';

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <Calendar />
    </Layout>
  );
};

export default IndexPage;
