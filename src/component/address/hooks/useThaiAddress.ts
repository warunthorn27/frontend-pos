import { useEffect, useState } from "react";
import {
  getProvinces,
  getDistricts,
  getSubDistricts,
  type SubDistrictItem,
} from "../../../services/address";

export const useThaiAddress = () => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrictItem[]>([]);

  const [province, _setProvince] = useState("");
  const [district, _setDistrict] = useState("");

  /*
    custom setters = จุดสำคัญ
    reset logic ไม่ควรอยู่ใน useEffect
  */

  const setProvince = (value: string) => {
    _setProvince(value);

    // reset dependent state
    _setDistrict("");
    setDistricts([]);
    setSubDistricts([]);
  };

  const setDistrict = (value: string) => {
    _setDistrict(value);

    // reset subdistrict
    setSubDistricts([]);
  };

  // โหลดจังหวัด (OK)
  useEffect(() => {
    getProvinces().then(setProvinces).catch(console.error);
  }, []);

  // โหลดอำเภอ (clean แล้ว)
  useEffect(() => {
    if (!province) return;

    getDistricts(province).then(setDistricts).catch(console.error);
  }, [province]);

  // โหลดตำบล (OK)
  useEffect(() => {
    if (!province || !district) return;

    getSubDistricts(province, district)
      .then(setSubDistricts)
      .catch(console.error);
  }, [province, district]);

  return {
    provinces,
    districts,
    subDistricts,

    province,
    district,

    setProvince,
    setDistrict,
  };
};
