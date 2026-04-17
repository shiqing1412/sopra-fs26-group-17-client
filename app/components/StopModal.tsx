import { Modal, Form, Input, TimePicker, Button, FormInstance } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import PlaceAutocomplete from "./LocationSearch";
import { NewStopValues } from "./TripCalendar";

export type StopFormValues = Omit<NewStopValues, 'id' | 'createdBy'>;

interface StopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (values: StopFormValues) => void;
  initialData: {
    stop: NewStopValues;
    date: Date;
  } | null;
  selectedDate: Date | null;
  form: FormInstance<StopFormValues>; 
  setSelectedPlace: (place: any) => void;
}

const StopModal: React.FC<StopModalProps> = ({ 
  isOpen, 
  onClose, 
  onFinish, 
  initialData, 
  selectedDate, 
  form, 
  setSelectedPlace 
}) => {
  const isEditMode = !!initialData;

  // load data if in edit mode
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData.stop) {
        form.setFieldsValue({
          title: initialData.stop.title,
          location: initialData.stop.location,
          startTime: initialData.stop.startTime ? dayjs(initialData.stop.startTime) : null,
          endTime: initialData.stop.endTime ? dayjs(initialData.stop.endTime) : null,
          notes: initialData.stop.notes,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, isEditMode, initialData, form]);

  const displayDate = isEditMode ? initialData?.date : selectedDate;

  return (
    <Modal
      title={
        <div>
          <div style={{ color: "#000", fontSize: 18, fontWeight: 600 }}>
            {isEditMode ? "Edit Stop" : "Add a Stop"}
          </div>
          <div style={{ color: "#888", fontSize: 14, fontWeight: 400 }}>
            {displayDate?.toLocaleDateString("en-US", { 
              weekday: "long", month: "long", day: "numeric" 
            })}
          </div>
        </div>
      }
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
    >
      <Form 
        form={form} 
        layout="vertical" 
        size="large" 
        style={{ marginTop: 16 }} 
        onFinish={onFinish}
      >
        <Form.Item 
          name="title" 
          label="TITLE" 
          rules={[{ required: true, message: "Please enter a title" }]} 
          style={{ marginBottom: 12 }}
        >
          <Input placeholder="e.g. Karaoke Night" />
        </Form.Item>
        <Form.Item 
          name="location" 
          label="LOCATION" 
          rules={[{ required: true, message: "Please enter a location" }]} 
          style={{ marginBottom: 12 }}
        >
          <PlaceAutocomplete 
            onPlaceSelect={setSelectedPlace} 
            key={isEditMode ? initialData?.stop?.location : 'new'} 
          />
        </Form.Item>
        <Form.Item label="TIME" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Form.Item name="startTime" noStyle>
              <TimePicker format="HH:mm" placeholder="From" style={{ flex: 1 }} needConfirm={false} />
            </Form.Item>
            <span style={{ color: "#c0392b" }}>→</span>
            <Form.Item name="endTime" noStyle>
              <TimePicker 
                format="HH:mm" 
                placeholder="To" 
                style={{ flex: 1 }} 
                needConfirm={false}
                disabledTime={() => {
                  const start = form.getFieldValue("startTime");
                  if (!start) return {};
                  return {
                    disabledHours: () => Array.from({ length: start.hour() }, (_, i) => i),
                    disabledMinutes: (hour) =>
                      hour === start.hour()
                        ? Array.from({ length: start.minute() + 1 }, (_, i) => i)
                        : [],
                  };
                }} 
              />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item name="notes" label="NOTES">
          <Input.TextArea placeholder="Reservations, tips, reminders…" rows={3} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => {
              form.resetFields();
              onClose();
            }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Save" : "Add"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StopModal;