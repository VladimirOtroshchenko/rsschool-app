import { Alert, Button, Col, Form, Input, message, Radio, Rate, Row, Typography } from 'antd';
import {
  CreateStudentFeedbackDtoEnglishLevelEnum as EnglishLevelEnum,
  CreateStudentFeedbackDtoRecommendationEnum as RecommendationEnum,
  SoftSkillEntryIdEnum,
  StudentsFeedbacksApi,
} from 'api';
import { PageLayoutSimple } from 'components/PageLayout';
import { UserSearch } from 'components/UserSearch';
import { getMentorId } from 'domain/user';
import { SessionContext } from 'modules/Course/contexts';
import { useMentorStudents } from 'modules/Mentor/hooks/useMentorStudents';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CourseOnlyPageProps } from 'services/models';
import * as routes from 'services/routes';
import { convertSoftSkillValueToEnum, softSkills } from '../../data/softSkills';

type FormValues = Record<SoftSkillEntryIdEnum, number> & {
  studentId: number;
  suggestions: string;
  recommendation: RecommendationEnum;
  recommendationComment: string;
  englishLevel: EnglishLevelEnum;
};

const englishLevels = [
  EnglishLevelEnum.A1,
  EnglishLevelEnum.A2,
  EnglishLevelEnum.B1,
  EnglishLevelEnum.B2,
  EnglishLevelEnum.C1,
  EnglishLevelEnum.C2,
];

export function StudentFeedback({ course }: CourseOnlyPageProps) {
  const session = useContext(SessionContext);
  const { githubId } = session;
  const { id: courseId, alias } = course;
  const mentorId = getMentorId(session, courseId);

  const [form] = Form.useForm();
  const router = useRouter();

  const [students, loading] = useMentorStudents(mentorId);
  const noData = students?.length === 0;

  useEffect(() => {
    if (noData) {
      return;
    }
    const studentId = router.query['studentId'] ? Number(router.query['studentId']) : null;
    form.setFieldsValue({ studentId });
  }, [students]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const { studentId, ...rest } = values;

      const payload = {
        recommendation: rest.recommendation,
        content: {
          suggestions: rest.suggestions ?? '',
          recommendationComment: rest.recommendationComment,
          softSkills: softSkills.map(({ id }) => ({ id, value: convertSoftSkillValueToEnum(rest[id]) })),
        },
        englishLevel: rest.englishLevel ? rest.englishLevel : EnglishLevelEnum.Unknown,
      };
      await new StudentsFeedbacksApi().createStudentFeedback(studentId, payload);
      message.success('Feedback successfully sent');
      router.push(routes.getMentorStudentsRoute(alias));
    } catch (e) {
      message.error('Error occurred while creating feedback. Please try later.');
    }
  };

  return (
    <PageLayoutSimple noData={noData} title="Recommendation Letter" loading={loading} githubId={githubId}>
      <Alert
        showIcon
        type="info"
        message={
          <>
            <div>This feedback is very important for RS School process.</div>
            <div>Please spend 5 minutes to complete it. Thank you!</div>
          </>
        }
      />
      <Alert
        style={{ marginTop: 8 }}
        showIcon
        type="warning"
        message={
          <div>If you recommend to "Hire", we will attach the feedback to student's CV and it will be public.</div>
        }
      />
      <Form style={{ margin: '24px 0' }} onFinish={handleSubmit} form={form} layout="vertical">
        <Form.Item name="studentId" label="Student">
          <UserSearch allowClear={false} clearIcon={false} defaultValues={students} keyField="id" />
        </Form.Item>
        <Typography.Title level={5}>Recommended To</Typography.Title>
        <Form.Item name="recommendation" rules={[{ required: true, message: 'Required' }]}>
          <Radio.Group>
            <Radio.Button value={RecommendationEnum.Hire}>Hire</Radio.Button>
            <Radio.Button value={RecommendationEnum.NotHire}>Not Hire</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="recommendationComment" rules={[{ required: true, message: 'Required' }]} label="What was good">
          <Input.TextArea rows={7} />
        </Form.Item>
        <Form.Item name="suggestions" label="What could be improved">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Typography.Title level={5}>English</Typography.Title>
        <Form.Item label="Approximate English level" name="englishLevel">
          <Radio.Group>
            {englishLevels.map(level => (
              <Radio.Button key={level} value={level}>
                {level.toUpperCase()}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Typography.Title level={5}>Soft Skills</Typography.Title>
        <Row wrap={true}>
          {softSkills.map(({ id, name }) => (
            <Col key={id} span={12}>
              <Form.Item key={id} label={name} name={id}>
                <Rate />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </PageLayoutSimple>
  );
}
